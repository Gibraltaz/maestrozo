/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */
import { readFile, writeFile, access, constants } from "node:fs/promises";

import { MaestrozoStore, StoreKey, StoreValue } from './MaestrozoStore';
import { checkStoreKey, checkStoreValue } from './storeUtils';

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

  async getItem(key: StoreKey) : Promise<StoreValue | null> {
    await this.initialize();
    checkStoreKey(key);
    const value = this._map.get(key) ?? null;
    return value;
  }

  async setItem(key: StoreKey, value:  StoreValue): Promise<void> {
    await this.initialize();
    checkStoreKey(key);
    checkStoreValue(value);
    // convert object to JSON object by removing properties witch have function as value
    // (ATTENTION : properties with undefined value are removed)
    let cleanValue: StoreValue;
    try {
      cleanValue = JSON.parse(JSON.stringify(value));
    }
    catch (err) {
      throw new Error("Value is not JSON serializable", { cause: err });
    }
    this._map.set(key, cleanValue);
    await this.saveFile();
  }

  get path(): string {
    return this._path;
  }

  get initialized(): boolean {
    return this._initialized;
  }
};

export { FileStore };
