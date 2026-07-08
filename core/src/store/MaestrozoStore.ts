/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

type StoreKey = string & { __brand: 'store-key' }; 

type StoreValue = any & { __brand: 'store-value' }; 

interface MaestrozoStore {

  getItem(key: StoreKey) : StoreValue | null;
  setItem(key: StoreKey, item:  StoreValue): void;

};

export { MaestrozoStore, StoreKey, StoreValue };
