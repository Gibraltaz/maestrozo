/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MtzEngine } from '@/Engine';
import { MaestrozoStore } from '@/store/MaestrozoStore';
import { RawMemoryStore } from '@/store/RawMemoryStore';

class MtzCore {
  public readonly version = '0.0.1';
  private engine : MtzEngine;

  constructor () {
    this.engine = new MtzEngine();
  }

  public async initialize (runtimeStore?: MaestrozoStore) {
    if (runtimeStore === undefined)
      runtimeStore = new RawMemoryStore();
    await this.engine.initialize(runtimeStore);
  }

  public async runOnce(): Promise<void> {
    if (! this.engine.initialized)
      throw new Error("Core not initialized");
    await this.engine.runOnce();
  }

  public get initialized(): boolean {
    return this.engine.initialized;
  }

};

export { MtzCore };
