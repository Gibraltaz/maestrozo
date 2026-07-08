/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { Engine } from '@/Engine';
import { MaestrozoStore } from '@/store/MaestrozoStore';
import { RawMemoryStore } from '@/store/RawMemoryStore';

class MaestrozoCore {
  public readonly version = '0.0.1';
  private engine : Engine;

  constructor (runtimeStore?: MaestrozoStore) {
    if (runtimeStore === undefined)
      runtimeStore = new RawMemoryStore();
    this.engine = new Engine(runtimeStore);
  }

  public runOnce(): void {
    this.engine.runOnce();
  }

};

export { MaestrozoCore };
