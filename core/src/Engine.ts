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
import { MtzElement, ElementName, ElementPath } from '@/Element';
import { containerTypeName, rootTypeContainerName, dataTypeName, componentTypeContainerName, typeElementName } from './global';

import { FactoryFunction, FactoryHelpers, TypeHandler } from '@/typeHandlers/TypeHandler';

import { containerTypeElement } from './typeHandlers/containerTypeHandler';
import { integerTypeElement } from './typeHandlers/integerTypeHandler';
import { stringTypeElement } from './typeHandlers/stringTypeHandler';
import { booleanTypeElement } from './typeHandlers/booleanTypeHandler';
import { constantComponentTypeElement } from './typeHandlers/constantComponentTypeHandler';
import { variableComponentTypeElement } from './typeHandlers/variableComponentTypeHandler';
import { elementTypeElement } from './typeHandlers/elementTypeElement';

const runtimeContainerName = 'runtime' as ElementName;


class Engine {
  // store brut pour pouvoir stocker les types qui ont des fonctions associées
  private rootStore: MaestrozoStore = new RawMemoryStore;
  private runtimeStore: MaestrozoStore;

  constructor (runtimeStore: MaestrozoStore) {
    let storeKey;

    this.rootStore = new RawMemoryStore();
    this.runtimeStore = runtimeStore;

    // mise en place de root «#/»
    const rootElement = {
      elementName: rootName,
      parentPath: [] as ElementPath, // empty path exception because root as no parent
      elementType: [rootName, rootTypeContainerName, containerTypeName] as ElementPath,
      isContainer: true
    } as MtzElement;
    this.rootStore.setItem(pathToString([rootName]) as StoreKey, rootElement);


    // mise en place de «#/types»
    const rootTypeElement = {
      elementName: rootTypeContainerName,
      parentPath: getElementPath(rootElement),
      elementType: [rootName, rootTypeContainerName, containerTypeName] as ElementPath,
      isContainer: true
    } as MtzElement;
    storeKey = pathToString(getElementPath(rootTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, rootTypeElement);

    // mise en place de «#/types/type»
    // (type spécial qui représente le type de tous les éléments de type dans «/types»)
    const typeTypeElement = {
      elementName: typeElementName,
      parentPath: getElementPath(rootTypeElement),
      elementType: [rootName, rootTypeContainerName, typeElementName],
      isContainer: false
    } as MtzElement;
    storeKey = pathToString(getElementPath(typeTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, typeTypeElement);


    // mise en place de «#/types/element»
    storeKey = pathToString(getElementPath(elementTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, elementTypeElement);

    // mise en place de «#/types/container»
    storeKey = pathToString(getElementPath(containerTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, containerTypeElement);

    // mise en place de «#/types/data»
    const dataTypeElement = {
      elementName: dataTypeName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      elementType: [rootName, rootTypeContainerName, containerTypeName] as ElementPath,
      isContainer: true
    } as MtzElement;
    storeKey = pathToString(getElementPath(dataTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, dataTypeElement);

    // mise en place de «#/types/data/integer»
    storeKey = pathToString(getElementPath(integerTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, integerTypeElement);

    // mise en place de «#/types/data/string»
    storeKey = pathToString(getElementPath(stringTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, stringTypeElement);

    // mise en place de «#/types/data/boolean»
    storeKey = pathToString(getElementPath(booleanTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, booleanTypeElement);

    // mise en place de «#/types/components»
    const componentContainerTypeElement = {
      elementName: componentTypeContainerName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      elementType: [rootName, rootTypeContainerName, containerTypeName] as ElementPath,
      isContainer: true,
    } as MtzElement;
    storeKey = pathToString(getElementPath(componentContainerTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, componentContainerTypeElement);

    // mise en place de «#/types/components/constant»
    storeKey = pathToString(getElementPath(constantComponentTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, constantComponentTypeElement);

    // mise en place de «#/types/components/variable»
    storeKey = pathToString(getElementPath(variableComponentTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, variableComponentTypeElement);

    // mise en place de «#/types/runtime»
    const runtimeContainerElement = {
      elementName: runtimeContainerName,
      parentPath: [rootName] as ElementPath,
      elementType: [rootName, rootTypeContainerName, containerTypeName] as ElementPath,
      isContainer: true,
    } as MtzElement;
    storeKey = pathToString(getElementPath(runtimeContainerElement)) as StoreKey
    this.rootStore.setItem(storeKey, runtimeContainerElement);

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
    const isContainer = typeHandler?.isContainer ?? null;
    if (isContainer === null)
      throw new Error(`Property «isContainer» not defined in type handler of type «${pathToString(getElementPath(typeElement))}»`);
    if (typeof(isContainer) !== 'boolean')
      throw new Error(`Property «isContainer» is not a boolean in type handler of type «${pathToString(getElementPath(typeElement))}»`);

    const elementData = factory(elementName, parentPath, params, factoryHelpers);

    const element = {
      elementName,
      parentPath,
      elementType: typePath,
      isContainer,
      data: elementData
    } as MtzElement;

    this.rootStore.setItem(elementStoreKey, element);

    return element;
  }
}

export { Engine, ElementName, ElementPath };
