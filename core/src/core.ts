/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { maestrozoKernel, MaestrozoStore, RawMemoryStore } from 'maestrozo-kernel';
import { MtzEngine } from './Engine';

const VERSION = '0.0.1';

type MaestrozoCore = {
  version: string,
  runOnce(): Promise<void>
};

const maestrozoCore = async (store?: MaestrozoStore) : Promise<MaestrozoCore> => {

  if (store === undefined)
    store = new RawMemoryStore();
  const kernel = await maestrozoKernel(store);

  const engine = new MtzEngine(kernel);
  await engine.initialize(store);

  const runOnce = async () : Promise<void> => {
    await engine.runOnce();
  };

  return {
    version: VERSION,
    runOnce
  };
};


export { maestrozoCore };
export type { MaestrozoCore };
