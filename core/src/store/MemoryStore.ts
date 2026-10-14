/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementPath, MtzElement } from '../Element';
import { getElementPath, pathToString } from '../path';
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

  async getElement(elementPath: ElementPath): Promise<MtzElement | null> {
    const storeKey = pathToString(elementPath) as StoreKey;
    checkStoreKey(storeKey);
    const strValue = this._map.get(storeKey) ?? null;
    const element:MtzElement= (strValue === null) ? null : JSON.parse(strValue);
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
    // convert object to JSON object by removing properties witch have function as item
    // (ATTENTION : properties with undefined item are removed)
    let cleanElement: Element;
    try {
      cleanElement = JSON.parse(JSON.stringify(element));
    }
    catch (err) {
      throw new Error("Value is not JSON serializable", { cause: err });
    }
    this._map.set(storeKey, cleanElement);
    const strValue = JSON.stringify(cleanElement);
    this._map.set(storeKey, strValue);
  }

};

export { MemoryStore };
