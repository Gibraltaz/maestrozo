/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MaestrozoStore, RawMemoryStore } from 'maestrozo-kernel';
import { MtzEngine } from './Engine';

const VERSION = '0.0.1';

type MaestrozoCore = {
  version: string,
  runOnce(): Promise<void>
};

const maestrozoCore = async (runtimeStore?: MaestrozoStore) : Promise<MaestrozoCore> => {
  const engine = new MtzEngine();

  if (runtimeStore === undefined)
    runtimeStore = new RawMemoryStore();
  await engine.initialize(runtimeStore);

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
