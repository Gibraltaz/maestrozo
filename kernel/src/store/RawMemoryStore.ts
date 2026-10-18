/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementPath, MtzElement } from '../Element.js';
import { pathToString, getElementPath } from '../path.js';
import { MaestrozoStore, StoreKey, StoreValue } from './MaestrozoStore.js';
import { checkStoreKey, checkStoreValue } from './storeUtils.js';

/*
 * La classe «RawMemoryStore» accepte des éléments avec des pointeurs 
 * sur des fonctions comme c'est le cas pour les types qui ont un objet
 * TypeHandler avec des pointeurs sur les fonctions de callback.
 */
class RawMemoryStore implements MaestrozoStore{

  private _map = new Map<StoreKey, StoreValue>();

  async getElement(elementPath: ElementPath): Promise<MtzElement | null> {
    const storeKey = pathToString(elementPath) as StoreKey;
    checkStoreKey(storeKey);
    const element:MtzElement = this._map.get(storeKey) ?? null;
    // do not clone element because has references on functions
    return element;
  }

  async setElement(element: MtzElement): Promise<void> {
    const elementPath = getElementPath(element);
    const storeKey = pathToString(elementPath) as StoreKey;
    if (element.revision === 1) {
      if (this._map.has(storeKey))
        throw new Error(`Element «${storeKey}» already exists`);
    }
    else {
      if (! this._map.has(storeKey))
        throw new Error(`Element «${storeKey}» does not exist`);
    }
    checkStoreKey(storeKey);
    checkStoreValue(element);
    // create a copy to imit persistent storage behavior
    this._map.set(storeKey, {... element});
  }

};

export { RawMemoryStore };
