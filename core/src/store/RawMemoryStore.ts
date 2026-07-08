/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MaestrozoStore, StoreKey, StoreValue } from './MaestrozoStore';
import { checkStoreKey, checkStoreValue } from './storeUtils';

class RawMemoryStore implements MaestrozoStore{

  private map = new Map<StoreKey, StoreValue>();

  getItem(key: StoreKey) : StoreValue | null {
    checkStoreKey(key);
    return this.map.get(key) ?? null;
  }

  setItem(key: StoreKey, value:  StoreValue): void {
    checkStoreKey(key);
    checkStoreValue(value);
    this.map.set(key, value);
  }

};

export { RawMemoryStore };
