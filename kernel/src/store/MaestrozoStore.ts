/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementPath, MtzElement } from "../Element.js";

// TODO encore utilisé
type StoreKey = string & { __brand: 'store-key' }; 

// TODO encore utilisé
type StoreValue = any & { __brand: 'store-value' }; 

interface MaestrozoStore {
  getElement(elementPath: ElementPath) : Promise<MtzElement | null>;
  setElement(element: MtzElement) : Promise<void>;
};

export { MaestrozoStore, StoreKey, StoreValue };
