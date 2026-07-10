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
import { Element, ElementName, ElementPath } from '@/Element';


const rootTypeContainerName = 'types' as ElementName;
const containerTypeName = 'container' as ElementName;
const elementTypeName = 'element' as ElementName;

const dataTypeName = 'data' as ElementName;
const stringTypeName = 'string' as ElementName;
const integerTypeName = 'integer' as ElementName;
const booleanTypeName = 'boolean' as ElementName;

const componentTypeContainerName = 'components' as ElementName;
const constantComponentTypeName = 'constant' as ElementName;
const variableComponentTypeName = 'variable' as ElementName;

const runtimeContainerName = 'runtime' as ElementName;


class Engine {
  // store brut pour pouvoir stocker les types qui ont des fonctions associées
  private rootStore: MaestrozoStore = new RawMemoryStore;
  private runtimeStore: MaestrozoStore;

  constructor (runtimeStore: MaestrozoStore) {
    let storeKey;

    this.rootStore = new RawMemoryStore();
    this.runtimeStore = runtimeStore;

    // mise en place de root «/»
    const rootElement = {
      elementName: rootName,
      parentPath: [] as ElementPath, // empty path exception because root as no parent
      elementType: [rootName, elementTypeName, containerTypeName] as ElementPath
    } as Element;
    this.rootStore.setItem(pathToString([rootName]) as StoreKey, rootElement);


    // mise en place de «/types»
    const rootTypeElement = {
      elementName: rootTypeContainerName,
      parentPath: getElementPath(rootElement),
      elementType: [rootName, elementTypeName, containerTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(rootTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, rootTypeElement);

    // mise en place de «/types/element»
    const elementTypeElement = {
      elementName: elementTypeName,
      parentPath: getElementPath(rootTypeElement),
      elementType: [rootName, elementTypeName, elementTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(elementTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, elementTypeElement);

    // mise en place de «/types/container»
    const containerTypeElement = {
      elementName: containerTypeName,
      parentPath: [rootName, rootTypeContainerName] as ElementPath,
      elementType: [rootName, elementTypeName, elementTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(containerTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, containerTypeElement);

    // mise en place de «/types/data»
    const dataTypeElement = {
      elementName: dataTypeName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      elementType: [rootName, elementTypeName, containerTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(dataTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, dataTypeElement);

    // mise en place de «/types/data/integer»
    const integerTypeElement = {
      elementName: integerTypeName,
      parentPath: [rootName, rootTypeContainerName, dataTypeName ] as ElementPath,
      elementType: [rootName, elementTypeName, containerTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(integerTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, integerTypeElement);

    // mise en place de «/types/data/string»
    const stringTypeElement = {
      elementName: stringTypeName,
      parentPath: [rootName, rootTypeContainerName, dataTypeName ] as ElementPath,
      elementType: [rootName, elementTypeName, containerTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(stringTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, stringTypeElement);

    // mise en place de «/types/data/boolean»
    const booleanTypeElement = {
      elementName: booleanTypeName,
      parentPath: [rootName, rootTypeContainerName, dataTypeName ] as ElementPath,
      elementType: [rootName, elementTypeName, containerTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(booleanTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, booleanTypeElement);

    // mise en place de «/types/components»
    const componentContainerTypeElement = {
      elementName: componentTypeContainerName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      elementType: [rootName, elementTypeName, containerTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(componentContainerTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, componentContainerTypeElement);

    // mise en place de «/types/components/constant»
    const constantTypeElement = {
      elementName: constantComponentTypeName,
      parentPath: [rootName, rootTypeContainerName, componentTypeContainerName] as ElementPath,
      elementType: [rootName, elementTypeName, containerTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(constantTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, constantTypeElement);

    // mise en place de «/types/components/variable»
    const variableTypeElement = {
      elementName: variableComponentTypeName,
      parentPath: [rootName, rootTypeContainerName, componentTypeContainerName] as ElementPath,
      elementType: [rootName, elementTypeName, containerTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(variableTypeElement)) as StoreKey
    this.rootStore.setItem(storeKey, variableTypeElement);

    // mise en place de «/types/runtime»
    const runtimeContainerElement = {
      elementName: runtimeContainerName,
      parentPath: [rootName] as ElementPath,
      elementType: [rootName, elementTypeName, containerTypeName] as ElementPath
    } as Element;
    storeKey = pathToString(getElementPath(runtimeContainerElement)) as StoreKey
    this.rootStore.setItem(storeKey, runtimeContainerElement);

  }

  public runOnce(): void {
  }

  public getElement(elementPath: ElementPath): Element {
    // TODO renvoyer les éléments du store de runtime
    return this.rootStore.getItem(pathToString(elementPath) as StoreKey);
  }

  public createElement(
    elementName: ElementName,
    parentPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>
  ): Element {
    // FIXME à remonter dans MaestrozoCore ?
    checkElementName(elementName);
    checkElementPath(parentPath);
    checkElementPath(typePath);

    const typeElement = this.getElement(typePath);
    if (typeElement === null)
      throw new Error(`Can not find parent «${pathToString(typePath)}»`);

    if (! pathStartsWith(typeElement.parentPath, [rootName, rootTypeContainerName, componentTypeContainerName] ))
        throw new Error(`Path «${pathToString(typePath)} is not a component type path`);

    const parentElement = this.getElement(parentPath);
    if (parentElement === null)
      throw new Error(`Can not find parent «${pathToString(parentPath)}»`);

    if (! pathStartsWith(getElementPath(parentElement), [rootName, runtimeContainerName] ))
        throw new Error(`Path «${pathToString(parentPath)} is not a runtime path`);

    //console.log("dOm params", params);
    return {} as Element
  }
}

export { Engine, ElementName, ElementPath };
