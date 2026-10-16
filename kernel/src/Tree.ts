import { checkElement, ElementData, ElementName, ElementPath, MtzElement } from './Element.js';
import { buildElementCapabilities } from './elementCapabilities.js';
import { containerTypeName, rootTypeContainerName } from './global.js';
import { checkElementName, checkElementPath, getElementPath, pathStartsWith, pathToString, rootName } from './path.js';
import { MaestrozoStore } from './store/MaestrozoStore.js';
import { RawMemoryStore } from './store/RawMemoryStore.js';
import { containerTypeDeclaration } from './typeHandlers/containerTypeHandler.js';
import {
    BuildElementDataCallback,
  BuildElementDataFunction,
  BuildElementDataHelpers,
  //TODO migration kernel : BuildElementDataCallback, BuildElementDataFunction, BuildElementDataHelpers, 
  elementTypeDeclaration, InitializeElementCallback, InitializeElementFunction
} from './typeHandlers/elementTypeHandler';


import { TypeDeclaration, TypeHandler } from './typeHandlers/TypeHandler';
import { typeTypeDeclaration } from './typeHandlers/typeTypeHandler';

type ContainerDeclaration = {
  elementName: ElementName,
  parentPath: ElementPath,
  isVolatile: boolean
};


class MtzTree {
  private _initialized = false;
  private persistentStore: MaestrozoStore| null = null;
  private volatileStore: MaestrozoStore = new RawMemoryStore;

  public async initialize (store: MaestrozoStore) {
    if (this._initialized)
      throw new Error("Maestrozo's Tree already initialized");

    this.volatileStore = new RawMemoryStore();
    this.persistentStore = store;

    // mise en place de root «#/»
    const rootElement = await this.declareContainer({
      elementName: rootName,
      parentPath: [] as ElementPath, // empty path exception because root as no parent
      isVolatile: false
    });

    // mise en place de «#/types»
    await this.declareContainer({
      elementName: rootTypeContainerName,
      parentPath: getElementPath(rootElement),
      isVolatile: true
    });

    // mise en place de «#/types/type»
    // (type spécial qui représente le type de tous les éléments de type dans «/types»)
    await this.declareTypeInternal(typeTypeDeclaration, true);

    // mise en place de «#/types/element»
    await this.declareTypeInternal(elementTypeDeclaration, false);

    // mise en place de «#/types/container»
    await this.declareTypeInternal(containerTypeDeclaration, false);

    this._initialized = true;

  }

  public async declareContainer(containerDeclaration: ContainerDeclaration): Promise<MtzElement> {

    const containerPath = [...containerDeclaration.parentPath, containerDeclaration.elementName] as ElementPath;

    let containerElement = await this.getStoredElement(containerPath);
    if (containerElement !== null) {
      if (containerDeclaration.isVolatile)
        throw new Error(`Container «${pathToString(containerPath)}» already exists`);
      return containerElement;
    }

    containerElement = {
      revision: 0,
      elementName: containerDeclaration.elementName,
      parentPath: containerDeclaration.parentPath,
      elementType: [rootName, rootTypeContainerName, containerTypeName],
      isContainer: true,
      isVolatile: containerDeclaration.isVolatile,
      childNames: [],
      data: null,
    } as MtzElement;

    await this.storeNewElement(containerElement);
    return containerElement;
  }

  public async getStoredElement(elementPath: ElementPath): Promise<MtzElement|null> {
    let element = await this.volatileStore.getElement(elementPath);
    if (element === null) {
      if (this.persistentStore === null)
        throw new Error("Persistent store is null");
      element = await this.persistentStore.getElement(elementPath);
    }
    return element;
  }

  private async createElementInStore(element: MtzElement): Promise<void> {
    if (element.isVolatile)
      await this.volatileStore.setElement(element);
    else {
      if (this.persistentStore === null)
        throw new Error("Persistent store is null");
      await this.persistentStore.setElement(element);
    }
  }

  
  public async updateElementInStore(element: MtzElement): Promise<void> {
    if (element.isVolatile)
      await this.volatileStore.setElement(element);
    else {
      if (this.persistentStore === null)
        throw new Error("Persistent store is null");
      await this.persistentStore.setElement(element);
    }
  }

// TODO migration kernel : à mettre en private
public async storeNewElement(element: MtzElement): Promise<void> {

    checkElement(element);

    const elementPath = getElementPath(element);
    if (await this.getStoredElement(elementPath))
      throw new Error(`Element «${elementPath}» already exists`);

    let parentElement;
    if (element.elementName === rootName && element.parentPath.length === 0) {
      parentElement = null; // l'élément racine n'a pas de parent
    }
    else {
      const parentPath = element.parentPath;
      parentElement = await this.getStoredElement(parentPath);
      if (parentElement === null)
        throw new Error(`Parent of element «${pathToString(elementPath)}» does not exist`);
      if (! parentElement.isContainer)
        throw new Error(`Parent of element «${pathToString(elementPath)}» is not a container`);
    }

    if (element.isContainer) {
      if (element.childNames === null)
        throw new Error(`Child name list not initialized in container «${pathToString(elementPath)}»`);
    }
    else {
      if (element.childNames !== null)
        throw new Error(`Child name list initialized in non-container «${pathToString(elementPath)}»`);
    }

    if (element.revision !== 0)
      throw new Error(`Revision of new element «${pathToString(elementPath)}» must be zero`);
    element.revision = 1;


    await this.createElementInStore(element);

    if (parentElement) {
      if (parentElement.childNames === null)
        throw new Error("Parent element childNames array is null");
      parentElement.childNames.push(element.elementName);
      parentElement.revision++;
      if (parentElement.isVolatile) {
        await this.volatileStore.setElement(parentElement);
      }
      else {
        if (this.persistentStore === null)
          throw new Error("Persistent store is null");
        await this.persistentStore.setElement(parentElement);
      }
    }
  };

  public async modifyElement(element: MtzElement): Promise<void> {
    const originalElement = await this.getStoredElement(getElementPath(element));
    if (originalElement === null)
      throw new Error(`Element «${pathToString(getElementPath(element))}» does not exist`);

    if (originalElement.revision !== element.revision)
      throw new Error(`Conflict in edition of element «${pathToString(getElementPath(element))}»`);

    element.revision++;
    await this.updateElementInStore(element);
  }

  private async declareTypeInternal(typeDeclaration: TypeDeclaration, force: boolean): Promise<MtzElement> {

    if (! force) {
      if (await this.getStoredElement(typeDeclaration.parentPath) === null)
        throw new Error(`Parent «${pathToString(typeDeclaration.parentPath)}» does not exist`);

      if (await this.getStoredElement(typeDeclaration.elementType) === null)
        throw new Error(`Type «${pathToString(typeDeclaration.elementType)}» does not exist`);

      const isType = pathStartsWith(typeDeclaration.parentPath, [rootName, rootTypeContainerName]);
      if (! isType)
        throw new Error(`Type «${typeDeclaration.elementName}» should be declare in ${pathToString([rootName, rootTypeContainerName])}`);
    }

    const typePath = pathToString([...typeDeclaration.parentPath, typeDeclaration.elementName]);

    const isDerivable = typeDeclaration?.isDerivable ?? null;
    if (isDerivable === null)
      throw new Error(`Type «${typePath}» declaration has no «isDerivable» property`);

    const isContainer = typeDeclaration?.isContainer ?? null;
    if (isContainer === null)
      throw new Error(`Type «${typePath}» declaration has no «isContainer» property`);

    const isVolatile = typeDeclaration?.isVolatile ?? null;
    if (isVolatile === null)
      throw new Error(`Type «${typePath}» declaration has no «isVolatile» property`);

    const typeHandler: TypeHandler = {
      isContainer,
      isVolatile,
      callbacks: [...typeDeclaration?.callbacks ?? []]
    };

    const element = {
      revision: 0,
      elementName: typeDeclaration.elementName,
      parentPath: typeDeclaration.parentPath,
      elementType: typeDeclaration.elementType,
      isContainer: isDerivable ? true : false,
      isVolatile: true,
      childNames: isDerivable ? [] as Array<ElementName> : null,
      data: {
        typeHandler
      }
    } as MtzElement;

    await this.storeNewElement(element);
    return element;
  }

  public async declareType(typeDeclaration: TypeDeclaration): Promise<MtzElement> {
    return this.declareTypeInternal(typeDeclaration, false);
  }


  public get initialized() : boolean {
    return this._initialized;
  }

  public async getElement(elementPath: ElementPath): Promise<MtzElement|null> {
    if (! this._initialized)
      throw new Error("Engine not initialized");
    const element = await this.getStoredElement(elementPath);
    if (element === null)
      return null;
    // FIXME code en double avec createElementInternal
    const typePath = element.elementType;
    const typeElement = await this.getStoredElement(typePath);
    if (typeElement === null)
      throw new Error(`Can not find parent «${pathToString(typePath)}»`);
    const typeHandler: TypeHandler | null = typeElement?.data?.typeHandler as TypeHandler ?? null;
    if ( typeHandler === null)
      throw new Error(`Type handler not defined in type «${pathToString(getElementPath(typeElement))}»`);
    const initializeElementCallback = typeHandler.callbacks.find(callback => callback.name === InitializeElementCallback);
    if (initializeElementCallback !== undefined) {
      const capabilities = buildElementCapabilities(element, this);
      const initializeElementFunction = initializeElementCallback.function as InitializeElementFunction;
      if (typeof(initializeElementFunction) !== 'function')
        throw new Error(`Invalid initialize element callback a function`);
      await initializeElementFunction(element, capabilities );
    }
    return element;
  }

  public async createElementInternal(
    elementName: ElementName,
    parentPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>,
    force: boolean
  ): Promise<MtzElement> {

    if (! force && ! this._initialized)
      throw new Error("Engine not initialized");

    checkElementName(elementName);
    checkElementPath(parentPath);
    checkElementPath(typePath);

    const parentElement = await this.getStoredElement(parentPath);
    if (parentElement === null)
      throw new Error(`Parent element «${pathToString(parentPath)}» does not exist`);

    if (! parentElement.isContainer)
      throw new Error(`Parent element «${pathToString(parentPath)}» is not a container`);

    const elementPath = [...parentPath, elementName];
    if (await this.getStoredElement(elementPath) !== null)
      throw new Error(`Element «${pathToString([...parentPath, elementName])}» already exists`);

    const typeElement = await this.getStoredElement(typePath);
    if (typeElement === null)
      throw new Error(`Can not find parent «${pathToString(typePath)}»`);

    const typeHandler: TypeHandler | null = typeElement?.data?.typeHandler as TypeHandler ?? null;
    if ( typeHandler === null)
      throw new Error(`Type handler not defined in type «${pathToString(getElementPath(typeElement))}»`);

    const isContainer = typeHandler?.isContainer ?? null;
    if (isContainer === null)
      throw new Error(`Property «isContainer» not defined in type handler of type «${pathToString(getElementPath(typeElement))}»`);
    if (typeof(isContainer) !== 'boolean')
      throw new Error(`Property «isContainer» is not a boolean in type handler of type «${pathToString(getElementPath(typeElement))}»`);

    const isVolatile = typeHandler?.isVolatile ?? null;
    if (isVolatile === null)
      throw new Error(`Property «isVolatile» not defined in type handler of type «${pathToString(getElementPath(typeElement))}»`);
    if (typeof(isVolatile) !== 'boolean')
      throw new Error(`Property «isVolatile» is not a boolean in type handler of type «${pathToString(getElementPath(typeElement))}»`);
    if (parentElement.isVolatile && ! isVolatile)
      throw new Error(`Non volatile element «${pathToString(getElementPath(typeElement))}» can not be store in a volatile container`);


    const buildElementDataCallback = typeHandler.callbacks.find(callback => callback.name === BuildElementDataCallback);
    let elementData = {} as ElementData;

    if (buildElementDataCallback !== undefined) {

      //TODO autotest interdiction réutilisation helper
      let buildElementDataHelpersActive = true; // contrôle de la réutilisation des fonctions helper

      const buildElementDataHelpers: BuildElementDataHelpers = {
        getElement: async (elementPath:ElementPath): Promise<MtzElement|null> => {
          if (! buildElementDataHelpersActive)
            throw new Error(`Build element data helper «getChild» can no longer be used (element «${elementName}»)`);
          return await this.getStoredElement(elementPath);
        },
        // TODO retirer createChildElement du build data !
        createChildElement: async (
          childElementName: ElementName,
          childElementType: ElementPath,
          childParams: Record<string, any>
        ): Promise<MtzElement>  => {
          if (!buildElementDataHelpersActive)
            throw new Error(`Build element data helper «createChildElement» can no longer be used (element «${elementName}»)`);
          const childElement = await this.createElement(
            childElementName,
            elementPath,
            childElementType,
            childParams,
          );
          return childElement;
        }
      }

      const buildElementDataFunction = buildElementDataCallback.function as BuildElementDataFunction;
      if (typeof(buildElementDataFunction) !== 'function')
        throw new Error(`Build element data callback in type «${pathToString(getElementPath(typeElement))}» is not a function`);
      elementData = await buildElementDataFunction(elementName, parentPath, params, buildElementDataHelpers);
      buildElementDataHelpersActive = false; // interdire la réutilisation des fonctions helper
    }

    let element: MtzElement | null = {
      revision: 0,
      elementName,
      parentPath,
      elementType: typePath,
      isContainer,
      isVolatile,
      childNames: isContainer ? [] : null,
      data: elementData,
    };
    await this.storeNewElement(element);

    const initializeElementCallback = typeHandler.callbacks.find(callback => callback.name === InitializeElementCallback);
    if (initializeElementCallback !== undefined) {
      const capabilities = buildElementCapabilities(element, this);
      const initializeElementFunction = initializeElementCallback.function as InitializeElementFunction;
      if (typeof(initializeElementFunction) !== 'function')
        throw new Error(`Invalid initialize element callback a function`);
      await initializeElementFunction(element, capabilities );
    }

    return element;
  }

  public async createElement(
    elementName: ElementName,
    parentPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>
  ): Promise<MtzElement> {
    return await this.createElementInternal(elementName, parentPath, typePath, params, false);
  }

}

export { 
  MtzTree,
  ContainerDeclaration
};

