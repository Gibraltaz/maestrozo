/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementPath, MtzElement } from "./Element.js";
import { MtzTree } from "./Tree.js";
import { MaestrozoStore } from "./store/MaestrozoStore.js";
import { RawMemoryStore } from "./store/RawMemoryStore.js";
import { ContainerDeclaration } from './Tree.js';
import { TypeDeclaration } from "./typeHandlers/TypeHandler.js";

const VERSION = '0.0.1';

type MaestrozoKernelInitializeFunction = (store: MaestrozoStore) => Promise<void>; 
type MaestrozoKernelIsInitializedFunction = () => boolean; 
type MaestrozoKernelGetFunction = (elementPath: ElementPath) => Promise<MtzElement|null>;
type MaestrozoKernelDeclareContainerFunction = (containerDeclaration: ContainerDeclaration) => Promise<MtzElement>;
type MaestrozoKernelDeclareType = (typeDeclaration: TypeDeclaration) => Promise<MtzElement>;
type MaestrozoKernelModifiyElementFunction = (element: MtzElement) => Promise<void>;
type MaestrozoKernelStoreNewElement = (element: MtzElement) => Promise<void>;

type MaestrozoKernel = {
  initialize: MaestrozoKernelInitializeFunction,
  isInitialized: MaestrozoKernelIsInitializedFunction,
  version: string,
  getStoredElement: MaestrozoKernelGetFunction,
  modifyElement: MaestrozoKernelModifiyElementFunction,
  storeNewElement: MaestrozoKernelStoreNewElement, // TODO migration kernel : à supprimer
  declareContainer: MaestrozoKernelDeclareContainerFunction,
  declareType: MaestrozoKernelDeclareType ,
};

const maestrozoKernel = async (runtimeStore?: MaestrozoStore) : Promise<MaestrozoKernel> => {
  const tree = new MtzTree();
  if (runtimeStore === undefined)
    runtimeStore = new RawMemoryStore();
  await tree.initialize(runtimeStore);

  return {
    version: VERSION,
    initialize: (store: MaestrozoStore) => tree.initialize(store),
    isInitialized: () => tree.initialized,
    getStoredElement: (elementPath: ElementPath) => tree.getStoredElement(elementPath),
    modifyElement: (element: MtzElement) => tree.updateElementInStore(element),
    storeNewElement: (element: MtzElement) => tree.storeNewElement(element),
    declareContainer: (containerDeclaration: ContainerDeclaration) => tree.declareContainer(containerDeclaration),
    declareType: (typeDeclaration: TypeDeclaration) => tree.declareType(typeDeclaration)
  };
};


export { maestrozoKernel };
export type { MaestrozoKernel };
