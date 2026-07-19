/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright (C) 2026 Executive Gibraltaz
*/

import { MaestrozoStore, StoreKey } from '@/store/MaestrozoStore';
import { RawMemoryStore } from '@/store/RawMemoryStore';
import {
  checkElementName,
  checkElementPath,
  rootName,
  pathStartsWith,
  pathToString,
  getElementPath
} from '@/path';
import { MtzElement, ElementName, ElementPath, checkElement } from '@/Element';
import {
  containerTypeName,
  rootTypeContainerName,
  dataTypeName,
  componentTypeContainerName,
  pinTypeContainerName
} from './global';

import { FactoryFunction, FactoryHelpers, TypeDeclaration, TypeHandler } from '@/typeHandlers/TypeHandler';

import { containerTypeDeclaration} from './typeHandlers/containerTypeHandler';
import { integerTypeDeclaration } from './typeHandlers/integerTypeHandler';
import { stringTypeDeclaration } from './typeHandlers/stringTypeHandler';
import { booleanTypeDeclaration } from './typeHandlers/booleanTypeHandler';
import { inputPinTypeDeclaration, outputPinTypeDeclaration } from './typeHandlers/pinTypeHandlers';
import { constantComponentTypeDeclaration } from './typeHandlers/constantComponentTypeHandler';
import { variableComponentTypeDeclaration } from './typeHandlers/variableComponentTypeHandler';
import { elementTypeDeclaration } from './typeHandlers/elementTypeHandler';
import { typeTypeDeclaration } from './typeHandlers/typeTypeHandler';

const runtimeContainerName = 'runtime' as ElementName;

type ContainerDeclaration = {
  elementName: ElementName,
  parentPath: ElementPath,
  isVolatile: boolean
};

class MtzEngine {
  private _initialized = false;
  private persistentStorage: MaestrozoStore| null = null;
  private volatileStore: MaestrozoStore = new RawMemoryStore;


  private async getStoredElement(elementPath: ElementPath): Promise<MtzElement> {
    const storeKey = pathToString(elementPath) as StoreKey;
    let element = await this.volatileStore.getItem(storeKey);
    if (element === null) {
      if (this.persistentStorage === null)
        throw new Error("Persistent storage is null");
      element = await this.persistentStorage.getItem(storeKey);
    }
    return element;
  }

  private async storeElement(element: MtzElement): Promise<void> {
    const elementPath = getElementPath(element);
    const storeKey = pathToString(elementPath) as StoreKey;
    if (element.isVolatile)
      await this.volatileStore.setItem(storeKey , element);
    else {
      if (this.persistentStorage === null)
        throw new Error("Persistent storage is null");
      await this.persistentStorage.setItem(storeKey , element);
    }
  }

  private async storeNewElement(element: MtzElement): Promise<void> {

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
        throw new Error(`Parent of element «${pathToString(parentPath)}» does not exist`);
      if (! parentElement.isContainer)
        throw new Error(`Parent of element «${pathToString(parentPath)}» is not a container`);
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


    await this.storeElement(element);

    if (parentElement) {
      const parentStoreKey = pathToString(element.parentPath) as StoreKey;
      if (parentElement.childNames === null)
        throw new Error(`Child name list not initialized in element «${parentStoreKey}»`);
      parentElement.childNames.push(element.elementName);
      if (parentElement.isVolatile) {
        await this.volatileStore.setItem(parentStoreKey , parentElement);
      }
      else {
        if (this.persistentStorage === null)
          throw new Error("Persistent storage is null");
        await this.persistentStorage.setItem(parentStoreKey , parentElement);
      }
    }
  };


  private async declareContainer(args: ContainerDeclaration): Promise<MtzElement> {

    const containerPath = [...args.parentPath, args.elementName] as ElementPath;

    let containerElement = await this.getStoredElement(containerPath);
    if (containerElement !== null) {
      if (args.isVolatile)
        throw new Error(`Container «${pathToString(containerPath)}» already exists`);
      return containerElement;
    }

    containerElement = {
      revision: 0,
      elementName: args.elementName,
      parentPath: args.parentPath,
      elementType: [rootName, rootTypeContainerName, containerTypeName],
      isContainer: true,
      isVolatile: args.isVolatile,
      childNames: [],
      data: null
    } as MtzElement;

    await this.storeNewElement(containerElement);
    return containerElement;
  }

  private async declareType(args: TypeDeclaration, force: boolean): Promise<MtzElement> {

    if (! force) {
      if (await this.getStoredElement(args.parentPath) === null)
        throw new Error(`Parent «${pathToString(args.parentPath)}» does not exist`);

      if (await this.getStoredElement(args.elementType) === null)
        throw new Error(`Type «${pathToString(args.elementType)}» does not exist`);

      const isType = pathStartsWith(args.parentPath, [rootName, rootTypeContainerName]);
      if (! isType)
        throw new Error(`Type «${args.elementName}» should be declare in ${pathToString([rootName, rootTypeContainerName])}`);
    }

    const typePath = pathToString([...args.parentPath, args.elementName]);

    const isDerivable = args?.isDerivable ?? null;
    if (isDerivable === null)
      throw new Error(`Type «${typePath}» declaration has no «isDerivable» property`);

    const isContainer = args?.isContainer ?? null;
    if (isContainer === null)
      throw new Error(`Type «${typePath}» declaration has no «isContainer» property`);

    const isVolatile = args?.isVolatile ?? null;
    if (isVolatile === null)
      throw new Error(`Type «${typePath}» declaration has no «isVolatile» property`);

    const factory = args?.factory ?? null;
    if (factory === null)
      throw new Error(`Type «${typePath}» declaration has no factory function`);

    const element = {
      revision: 0,
      elementName: args.elementName,
      parentPath: args.parentPath,
      elementType: args.elementType,
      isContainer: isDerivable ? true : false,
      isVolatile: true,
      childNames: isDerivable ? [] as Array<ElementName> : null,
      data: {
        typeHandler: {
          isContainer: args.isContainer,
          isVolatile: args.isVolatile,
          factory: args.factory
        }
      }
    } as MtzElement;

    await this.storeNewElement(element);
    return element;
  }


  public async initialize (storage: MaestrozoStore) {

    this.volatileStore = new RawMemoryStore();
    this.persistentStorage = storage;

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

    // mise en place de «#/types/data»
    await this.declareContainer({
      elementName: dataTypeName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      isVolatile: true
    });

    // mise en place de «#/types/components»
    await this.declareContainer({
      elementName: componentTypeContainerName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      isVolatile: true
    });

    // mise en place de «#/types/pins»
    await this.declareContainer({
      elementName: pinTypeContainerName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      isVolatile: true
    });

    // mise en place de «#/runtime»
    await this.declareContainer({
        elementName: runtimeContainerName,
        parentPath: [rootName] as ElementPath,
        isVolatile: false
      }
    );

    // mise en place de «#/types/type»
    // (type spécial qui représente le type de tous les éléments de type dans «/types»)
    await this.declareType(typeTypeDeclaration, true);

    // mise en place de «#/types/element»
    await this.declareType(elementTypeDeclaration, false);

    // mise en place de «#/types/container»
    await this.declareType(containerTypeDeclaration, false);

    // mise en place de «#/types/data/integer»
    await this.declareType(integerTypeDeclaration, false);

    // mise en place de «#/types/data/string»
    await this.declareType(stringTypeDeclaration, false);

    // mise en place de «#/types/data/boolean»
    await this.declareType(booleanTypeDeclaration, false);

    // mise en place de «#/types/pins/input-pin»
    await this.declareType(inputPinTypeDeclaration, false);

    // mise en place de «#/types/pins/output-pin»
    await this.declareType(outputPinTypeDeclaration, false);

    // mise en place de «#/types/components/constant»
    await this.declareType(constantComponentTypeDeclaration, false);

    // mise en place de «#/types/components/variable»
    await this.declareType(variableComponentTypeDeclaration, false);

    this._initialized = true;
  }

  public async runOnce(): Promise<void> {
    if (! this._initialized)
      throw new Error("Engine not initialized");
  }


  public async getElement(elementPath: ElementPath): Promise<MtzElement> {
    if (! this._initialized)
      throw new Error("Engine not initialized");
    return await this.getStoredElement(elementPath);
  }


  public async createElement(
    elementName: ElementName,
    parentPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>
  ): Promise<MtzElement> {

    if (! this._initialized)
      throw new Error("Engine not initialized");

    // TODO à remonter dans MtzCore
    checkElementName(elementName);
    checkElementPath(parentPath);
    checkElementPath(typePath);

    const parentElement = await this.getStoredElement(parentPath);
    if (parentElement === null)
      throw new Error(`Parent element «${pathToString(parentPath)}» does not exist`);

    if (! parentElement.isContainer)
      throw new Error(`Parent element «${pathToString(parentPath)}» is not a container`);

    const elementPath = [...parentPath, elementName];
    const elementStoreKey = pathToString([...parentPath, elementName]) as StoreKey;
    if (await this.getStoredElement(elementPath) !== null)
      throw new Error(`Element «${elementStoreKey}» already exists`);

    const typeElement = await this.getStoredElement(typePath);
    if (typeElement === null)
      throw new Error(`Can not find parent «${pathToString(typePath)}»`);

    if (! pathStartsWith(typeElement.parentPath, [rootName, rootTypeContainerName, componentTypeContainerName] ))
      throw new Error(`Path «${pathToString(typePath)} is not a component type path`);

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

    const factory: FactoryFunction | null = typeHandler?.factory ?? null;
    if (factory === null)
      throw new Error(`Factory not defined in type «${pathToString(getElementPath(typeElement))}»`);
    if (typeof(factory) !== 'function')
      throw new Error(`Factory not defined in type «${pathToString(getElementPath(typeElement))}»`);

    const factoryHelpers: FactoryHelpers = {
      getElement: async (elementPath:ElementPath): Promise<MtzElement> => {
        return await this.getStoredElement(elementPath)
      }
    }

    const elementData = await factory(elementName, parentPath, params, factoryHelpers);

    const element = {
      revision: 0,
      elementName,
      parentPath,
      elementType: typePath,
      isContainer,
      isVolatile,
      childNames: isContainer ? [] : null,
      data: elementData
    } as MtzElement;

    await this.storeNewElement(element);

    return element;
  }

  public async modifyElement(element: MtzElement): Promise<void> {
    const originalElement = await this.getStoredElement(getElementPath(element));
    if (originalElement === null)
      throw new Error(`Element «${pathToString(getElementPath(element))}» does not exist`);

    if (originalElement.revision !== element.revision)
      throw new Error(`Conflict in edition of element «${pathToString(getElementPath(element))}»`);

    element.revision++;
    await this.storeElement(element);
  }

  public get initialized() : boolean {
    return this._initialized;
  }
}

export { MtzEngine, ElementName, ElementPath };
