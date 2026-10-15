/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */
import { readFile, writeFile, access, constants } from "node:fs/promises";

import { MaestrozoStore, StoreKey, StoreValue } from './MaestrozoStore';
import { checkStoreKey, checkStoreValue } from './storeUtils';
import { ElementPath, MtzElement } from "../Element";
import { getElementPath, pathToString } from "../path";

const encoding = 'utf-8';

class FileStore implements MaestrozoStore{

  private _path: string;
  private _map = new Map<StoreKey, StoreValue>();
  private _initialized = false;

  constructor (path: string) {
    this._path = path;
  }

  private async saveFile(): Promise<void> {
    const fileContent = JSON.stringify([...this._map], null, 2);
    await writeFile(
      this._path,
      fileContent,
      'utf-8'
    );
  }

  private async loadFile(): Promise<void> {
    const fileContent = await readFile(
      this._path,
      encoding
    );
    this._map = new Map(JSON.parse(fileContent));
  }

  public async initialize() {
    if (this._initialized)
      return;
    if (await this.exists())
      await this.loadFile();
    else
      await this.saveFile(); // sauvegarde à vide pour réserver le nom de fichier
    this._initialized = true;
  }

  async exists(): Promise<boolean> {
    try {
      await access(this._path, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  get path(): string {
    return this._path;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  async getElement(elementPath: ElementPath): Promise<MtzElement | null> {
    await this.initialize();
    const storeKey = pathToString(elementPath) as StoreKey;
    checkStoreKey(storeKey);
    const element:MtzElement = this._map.get(storeKey) ?? null;
    return element;
  }

  async setElement(element: MtzElement): Promise<void> {
    await this.initialize();
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
    await this.saveFile();
  }

};

export { FileStore };
