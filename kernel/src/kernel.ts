/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MtzTree } from "./Tree";
import { MaestrozoStore } from "./store/MaestrozoStore";
import { RawMemoryStore } from "./store/RawMemoryStore";


const VERSION = '0.0.1';

type MaestrozoKernel = {
  version: string,
};

const maestrozoKernel = async (runtimeStore?: MaestrozoStore) : Promise<MaestrozoKernel> => {
  const tree = new MtzTree();
  if (runtimeStore === undefined)
    runtimeStore = new RawMemoryStore();
  await tree.initialize(runtimeStore);

  return {
    version: VERSION,
  };
};


export { maestrozoKernel };
export type { MaestrozoKernel };
