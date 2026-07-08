/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { StoreKey, StoreValue } from './MaestrozoStore';

const checkStoreKey = (storeKey: StoreKey): void => {
  if (storeKey === undefined)
    throw new Error("Store key must be defined");
  if (typeof(storeKey) !== 'string')
    throw new Error("Store key must be a string");
  if (storeKey.length === 0)
    throw new Error("Store key could not be empty");
}

const checkStoreValue = (storeValue: StoreValue): void => {
  if (storeValue === undefined)
    throw new Error("Store value must be defined");
}

export { checkStoreKey, checkStoreValue };
