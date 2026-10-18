/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { maestrozoKernel, MaestrozoStore, MtzElement, RawMemoryStore, TypeDeclaration, ContainerDeclaration, ElementPath } from 'maestrozo-kernel';
import { MtzEngine } from './Engine.js';

const VERSION = '0.0.1';

type MaestrozoCoreInitializeFunction = (store: MaestrozoStore) => Promise<void>; 
type MaestrozoCoreIsInitializedFunction = () => boolean; 
type MaestrozoCoreGetElementFunction = (elementPath: ElementPath) => Promise<MtzElement|null>; 
type MaestrozoCoreDeclareType = (typeDeclaration: TypeDeclaration) => Promise<MtzElement>;
type MaestrozoCoreDeclareContainerFunction = (containerDeclaration: ContainerDeclaration) => Promise<MtzElement>;

type MaestrozoCore = {
  version: string,
  initialize: MaestrozoCoreInitializeFunction,
  isInitialized: MaestrozoCoreIsInitializedFunction,
  getElement: MaestrozoCoreGetElementFunction,
  runOnce: () => Promise<void>,
  declareType: MaestrozoCoreDeclareType ,
  declareContainer: MaestrozoCoreDeclareContainerFunction,
};

const maestrozoCore = async (store?: MaestrozoStore) : Promise<MaestrozoCore> => {

  if (store === undefined)
    store = new RawMemoryStore();
  const kernel = await maestrozoKernel(store);

  const engine = new MtzEngine(kernel);
  await engine.initialize();

  const runOnce = async () : Promise<void> => {
    await engine.runOnce();
  };

  return {
    version: VERSION,
    runOnce,
    initialize: (store: MaestrozoStore) => kernel.initialize(store),
    isInitialized: () => kernel.isInitialized(),
    getElement: async (elementPath: ElementPath) => kernel.getStoredElement(elementPath),
    declareType: (typeDeclaration: TypeDeclaration) => kernel.declareType(typeDeclaration),
    declareContainer: (containerDeclaration: ContainerDeclaration) => kernel.declareContainer(containerDeclaration)
  };
};


export { maestrozoCore };
export type { MaestrozoCore };
