/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MaestrozoStore, StoreKey } from '@/store/MaestrozoStore';
import { RawMemoryStore } from '@/store/RawMemoryStore';
import { ElementName, ElementPath, pathToString } from '@/path';

type Element = {
  elementName: ElementName;
  parentPath : ElementPath;
  elementType: ElementPath;
};

const rootTypeContainerName = 'types' as ElementName;
const containerTypeName = 'container' as ElementName;
const elementTypeName = 'element' as ElementName;

class Engine {
  // store brut pour pouvoir stocker les types qui ont des fonctions associées
  private rootStore: MaestrozoStore = new RawMemoryStore;
  private runtimeStore: MaestrozoStore;

  constructor (runtimeStore: MaestrozoStore) {
    this.rootStore = new RawMemoryStore();
    this.runtimeStore = runtimeStore;

    // mise en place de /types
    const rootTypeElement = {
      elementName: rootTypeContainerName,
      parentPath: [] as ElementPath,
      elementType: [elementTypeName, containerTypeName] as ElementPath
    } as Element;
    this.rootStore.setItem(pathToString([rootTypeContainerName]) as StoreKey, rootTypeElement);

    // mise en place de /types/element
    const elementTypeElement = {
      elementName: elementTypeName,
      parentPath: [rootTypeContainerName] as ElementPath,
      elementType: [elementTypeName, elementTypeName] as ElementPath
    } as Element;
    this.rootStore.setItem(pathToString([rootTypeContainerName, elementTypeName]) as StoreKey, elementTypeElement);

    // mise en place de /types/container
    const containerTypeElement = {
      elementName: containerTypeName,
      parentPath: [rootTypeContainerName] as ElementPath,
      elementType: [elementTypeName, elementTypeName] as ElementPath
    } as Element;
    this.rootStore.setItem(pathToString([rootTypeContainerName, containerTypeName]) as StoreKey, containerTypeElement);


  }

  public runOnce(): void {
  }

  public getElement(elementPath: ElementPath): Element {
    // TODO renvoyer les éléments du store de runtime
    return this.rootStore.getItem(pathToString(elementPath) as StoreKey);
  }

}

export { Engine, ElementName, ElementPath };
