/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MaestrozoStore } from '@/store/MaestrozoStore';
import { RawMemoryStore } from '@/store/RawMemoryStore';

class Engine {
  // store brut pour pouvoir stocker les types qui ont des fonctions associées
  private rootStore: MaestrozoStore = new RawMemoryStore;
  private runtimeStore: MaestrozoStore;

  constructor (runtimeStore: MaestrozoStore) {
    this.rootStore = new RawMemoryStore();
    this.runtimeStore = runtimeStore;
    // TODO déclarer les types
  }

  public runOnce(): void {
  }

}

export { Engine };
