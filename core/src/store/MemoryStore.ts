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

  private map = new Map<StoreKey, StoreValue>();

  async getItem(key: StoreKey) : Promise<StoreValue | null> {
    checkStoreKey(key);
    const strValue = this.map.get(key) ?? null;
    const value = (strValue === null) ? null : JSON.parse(strValue);
    return value;
  }

  async setItem(key: StoreKey, value:  StoreValue): Promise<void> {
    checkStoreKey(key);
    checkStoreValue(value);
    const strValue = JSON.stringify(value);
    this.map.set(key, strValue);
  }

};

export { MemoryStore };
