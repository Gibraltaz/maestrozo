/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MaestrozoStore, StoreKey, StoreValue } from './MaestrozoStore';
import { checkStoreKey, checkStoreValue } from './storeUtils';

/*
 * La classe «MemoryStore» stocke les valeurs sous forme de chaînes de caractères
 * contenant du JSON (contrairement à la classe «RawMemoryStore»).
 * Elle permet de reproduire le comportement des stockages persistants qui ne
 * peuvent stocker que des données.
 * Elle ne peut donc pas être utilisée pour stocker les éléments de TypeHandler
 * qui contiennent des objets «TypeHandler» avec des pointeurs sur des fonctions.
 */
class MemoryStore implements MaestrozoStore{

  private _map = new Map<StoreKey, StoreValue>();

  async getItem(key: StoreKey) : Promise<StoreValue | null> {
    checkStoreKey(key);
    const strValue = this._map.get(key) ?? null;
    const item = (strValue === null) ? null : JSON.parse(strValue);
    return item;
  }

  async createItem(key: StoreKey, item:  StoreValue): Promise<void> {
    checkStoreKey(key);
    checkStoreValue(item);
    if (this._map.has(key))
      throw new Error(`Item «${key}» already exists`);
    const strValue = JSON.stringify(item);
    this._map.set(key, strValue);
  }

  async updateItem(key: StoreKey, item:  StoreValue): Promise<void> {
    checkStoreKey(key);
    checkStoreValue(item);
    if (!this._map.has(key))
      throw new Error(`Item «${key}» does not exist`);
    const strValue = JSON.stringify(item);
    this._map.set(key, strValue);
  }

};

export { MemoryStore };
