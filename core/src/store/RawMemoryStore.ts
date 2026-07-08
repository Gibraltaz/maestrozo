/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MaestrozoStore, StoreKey, StoreValue } from './MaestrozoStore';

class RawMemoryStore implements MaestrozoStore{

  private map = new Map<StoreKey, StoreValue>();

  getItem(key: StoreKey) : StoreValue | null {
    return this.map.get(key) ?? null;
  }

  setItem(key: StoreKey, item:  StoreValue): void {
    this.map.set(key, item);
  }

};

export { RawMemoryStore };
