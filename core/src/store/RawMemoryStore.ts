/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MaestrozoStore, StoreKey, StoreValue } from './MaestrozoStore';
import { checkStoreKey, checkStoreValue } from './storeUtils';

class RawMemoryStore implements MaestrozoStore{

  private _map = new Map<StoreKey, StoreValue>();

  async getItem(key: StoreKey) : Promise<StoreValue | null> {
    checkStoreKey(key);
    return this._map.get(key) ?? null;
  }

  async createItem(key: StoreKey, item:  StoreValue): Promise<void> {
    checkStoreKey(key);
    checkStoreValue(item);
    if (this._map.has(key))
      throw new Error(`Item «${key}» already exists`);
    this._map.set(key, item);
  }

  async updateItem(key: StoreKey, item:  StoreValue): Promise<void> {
    checkStoreKey(key);
    checkStoreValue(item);
    if (!this._map.has(key))
      throw new Error(`Item «${key}» does not exist`);
    this._map.set(key, item);
  }

};

export { RawMemoryStore };
