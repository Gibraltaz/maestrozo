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
import { MtzElement, ElementName, ElementPath, ElementData } from '@/Element';
import { containerTypeName, rootTypeContainerName, dataTypeName, componentTypeContainerName, typeElementName } from './global';

import { FactoryFunction, FactoryHelpers, TypeDeclaration, TypeHandler } from '@/typeHandlers/TypeHandler';

import { containerTypeDeclaration} from './typeHandlers/containerTypeHandler';
import { integerTypeDeclaration } from './typeHandlers/integerTypeHandler';
import { stringTypeDeclaration } from './typeHandlers/stringTypeHandler';
import { booleanTypeDeclaration } from './typeHandlers/booleanTypeHandler';
import { constantComponentTypeDeclaration } from './typeHandlers/constantComponentTypeHandler';
import { variableComponentTypeDeclaration } from './typeHandlers/variableComponentTypeHandler';
import { elementTypeDeclaration } from './typeHandlers/elementTypeHandler';

const runtimeContainerName = 'runtime' as ElementName;

type ContainerDeclaration = {
  elementName: ElementName,
  parentPath: ElementPath,
  isVolatile: boolean
};

class Engine {
  // store brut pour pouvoir stocker les types qui ont des fonctions associées
  private rootStore: MaestrozoStore = new RawMemoryStore;
  private runtimeStore: MaestrozoStore;



  private declareContainer(args: ContainerDeclaration): MtzElement {

    const containerPath = [...args.parentPath, args.elementName] as ElementPath;

    let containerElement = this.getElement(containerPath);
    if (containerElement !== null) {
      if (args.isVolatile)
        throw new Error(`Container «${pathToString(containerPath)}» already exists`);
      return containerElement;
    }

    containerElement = {
      elementName: args.elementName,
      parentPath: args.parentPath,
      elementType: [rootName, rootTypeContainerName, containerTypeName],
      isContainer: true,
      isVolatile: args.isVolatile,
      childNames: [],
      data: null
    } as MtzElement;

    this.rootStore.setItem(pathToString(containerPath) as StoreKey, containerElement);
    return containerElement;
  }


  private declareType(args: TypeDeclaration, force: boolean): MtzElement {

    if (! force) {
      if (this.getElement(args.parentPath) === null)
        throw new Error(`Parent «${pathToString(args.parentPath)}» does not exist`);

      if (this.getElement(args.elementType) === null)
        throw new Error(`Type «${pathToString(args.elementType)}» does not exist`);

      const isType = pathStartsWith(args.parentPath, [rootName, rootTypeContainerName]);
      if (! isType)
        throw new Error(`Type «${args.elementName}» should be declare in ${pathToString([rootName, rootTypeContainerName])}`);
    }

    // tous les types déclarés ne sont pas instanciables directement (comme /types/type)
    const typeHandler = args?.data?.typeHandler ?? null;
    if (typeHandler) {

      const isContainer = typeHandler?.isContainer ?? null;
      if (isContainer === null)
        throw new Error(`Type «${pathToString(args.elementType)}» data has no «isContainer» property`);

      const isVolatile = typeHandler?.isVolatile ?? null;
      if (isVolatile === null)
        throw new Error(`Type «${pathToString(args.elementType)}» data has no «isVolatile» property`);

      const factory = typeHandler?.factory ?? null;
      if (factory === null)
        throw new Error(`Type «${pathToString(args.elementType)}» data has no factory function`);

    }

    const element = {
      elementName: args.elementName,
      parentPath: args.parentPath,
      elementType: args.elementType,
      childNames: [] as Array<ElementName>,
      isContainer: args.isContainer,
      isVolatile: args.isVolatile,
      data: args.data
    } as MtzElement;

    this.rootStore.setItem(pathToString(getElementPath(element)) as StoreKey, element);
    return element;
  }


  constructor (runtimeStore: MaestrozoStore) {

    this.rootStore = new RawMemoryStore();
    this.runtimeStore = runtimeStore;

    // mise en place de root «#/»
    const rootElement = this.declareContainer({
      elementName: rootName,
      parentPath: [] as ElementPath, // empty path exception because root as no parent
      isVolatile: false
    });

    // mise en place de «#/types»
    const rootTypeElement = this.declareContainer({
      elementName: rootTypeContainerName,
      parentPath: getElementPath(rootElement),
      isVolatile: true
    });

    // mise en place de «#/types/data»
    this.declareContainer({
      elementName: dataTypeName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      isVolatile: true
    });
    // mise en place de «#/types/components»
    this.declareContainer({
      elementName: componentTypeContainerName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      isVolatile: true
    });

    // mise en place de «#/runtime»
    this.declareContainer({
        elementName: runtimeContainerName,
        parentPath: [rootName] as ElementPath,
        isVolatile: false
      }
    );

    // mise en place de «#/types/type»
    // (type spécial qui représente le type de tous les éléments de type dans «/types»)
    this.declareType(
      {
        elementName: typeElementName,
        parentPath: getElementPath(rootTypeElement),
        elementType: [rootName, rootTypeContainerName, typeElementName],
        isContainer: false,
        isVolatile: true,
        data: null 
      },
      true
    );

    // mise en place de «#/types/element»
    this.declareType(elementTypeDeclaration, false);

    // mise en place de «#/types/container»
    this.declareType(containerTypeDeclaration, false);

    // mise en place de «#/types/data/integer»
    this.declareType(integerTypeDeclaration, false);

    // mise en place de «#/types/data/string»
    this.declareType(stringTypeDeclaration, false);


    // mise en place de «#/types/data/boolean»
    this.declareType(booleanTypeDeclaration, false);

    // mise en place de «#/types/components/constant»
    this.declareType(constantComponentTypeDeclaration, false);

    // mise en place de «#/types/components/variable»
    this.declareType(variableComponentTypeDeclaration, false);

  }

  public runOnce(): void {
  }

  public getElement(elementPath: ElementPath): MtzElement {
    // TODO renvoyer les éléments du store de runtime
    return this.rootStore.getItem(pathToString(elementPath) as StoreKey);
  }

  public createElement(
    elementName: ElementName,
    parentPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>
  ): MtzElement {

    // TODO à remonter dans MtzCore
    checkElementName(elementName);
    checkElementPath(parentPath);
    checkElementPath(typePath);

    const parentElement = this.getElement(parentPath);
    if (parentElement === null)
      throw new Error(`Parent element «${pathToString(parentPath)}» does not exist`);

    if (! parentElement.isContainer)
      throw new Error(`Parent element «${pathToString(parentPath)}» is not a container`);

    const elementStoreKey = pathToString([...parentPath, elementName]) as StoreKey;
    if (this.rootStore.getItem(elementStoreKey) !== null)
      throw new Error(`Element «${elementStoreKey}» already exists`);

    const typeElement = this.getElement(typePath);
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
      getElement: (elementPath:ElementPath): MtzElement => {
        return this.getElement(elementPath)
      }
    }

    const elementData = factory(elementName, parentPath, params, factoryHelpers);

    const element = {
      elementName,
      parentPath,
      elementType: typePath,
      isContainer,
      isVolatile,
      data: elementData
    } as MtzElement;

    this.rootStore.setItem(elementStoreKey, element);

    return element;
  }
}

export { Engine, ElementName, ElementPath };
