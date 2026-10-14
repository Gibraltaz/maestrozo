/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import Nano from 'nano';

import {
  MaestrozoStore, StoreKey, StoreValue,
  checkStoreKey, checkStoreValue
} from 'maestrozo-core';


class CouchDbStore implements MaestrozoStore{

  private _couchDb: any | null = null;
  private _db: any = null;
  private _initialized = false;

  constructor (
    private readonly _host: string,
    private readonly _port: number,
    private readonly _user: string,
    private readonly _password: string,
    private readonly _database: string
  ) {
  }

  private async initialize() {

    this._couchDb = Nano({
      url: `http://${encodeURIComponent(this._user)}:${encodeURIComponent(this._password)}@${this._host}:${this._port}`,
    });
    this._db = this._couchDb.use(this._database);
  }

  get initialized(): boolean {
    return this._initialized;
  }

  async getItem(key: StoreKey) : Promise<StoreValue | null> {
    await this.initialize();
    checkStoreKey(key);
    try {
      const result = await this._db.get(key);
      if (! result.value)
        throw new Error("CouchDb value not found");
      const couchDbId = result._id;
      const couchDbRev = result._rev;
      if (couchDbId === undefined)
          throw new Error("CouchDb id not set");
      if (couchDbRev === undefined)
          throw new Error("CouchDb rev not set");
      const value = result.value;
      value.storeData = { couchDbId, couchDbRev };
      return value;
    }
    catch (error: any) {
      if (error.error === 'not_found')
        return null;
      throw new Error(`CouchDB get error : ${error.description}`);
    }

  }

  async createItem(key: StoreKey, value:  StoreValue): Promise<void> {
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

    try {
      const result = await this._db.insert({ value: cleanValue }, key);
      if (! result.ok)
        throw new Error("CouchDb insertion is not OK");
      const couchDbId = result.id;
      const couchDbRev = result.rev;
      if (couchDbId === undefined)
          throw new Error("CouchDb id not set");
      if (couchDbRev === undefined)
          throw new Error("CouchDb rev not set");
      value.storeData = { couchDbId, couchDbRev };
    }
    catch (error:any) {
      if (error.code === 'EDOCCONFLICT')
        throw new Error(`Element «${key}» already exists`)
      throw new Error(error.message);
    }
  }

  async updateItem(key: StoreKey, value:  StoreValue): Promise<void> {
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

    try {
      const couchDbId = value.storeData.couchDbId;
      const couchDbRev = value.storeData.couchDbRev;
      if (couchDbId === undefined)
          throw new Error("CouchDb id not set in value");
      if (couchDbRev === undefined)
          throw new Error("CouchDb rev not set in value");
      const result = await this._db.insert({ _id: couchDbId, _rev: couchDbRev, value: cleanValue });
      if (! result.ok)
        throw new Error("CouchDb update is not OK");
      if (result.id === undefined)
          throw new Error("CouchDb id not set");
      if (result.rev === undefined)
          throw new Error("CouchDb rev not set");
      value.storeData.couchDbRev = result.rev;
    }
    catch (exception:any) {
      if (exception.code === 'EDOCCONFLICT')
        throw new Error(`Element «${key}» already exists`)
      throw new Error(exception.message);
    }
  }

};

export { CouchDbStore };
