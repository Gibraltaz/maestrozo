/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */
//@ts-ignore
import NodeCouchDb from 'node-couchdb';


import {
  MaestrozoStore, StoreKey, StoreValue,
  checkStoreKey, checkStoreValue
} from 'maestrozo-core';


class CouchDbStore implements MaestrozoStore{

  private _couchDb: NodeCouchDb | null = null;
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

    this._couchDb = new NodeCouchDb({
      host: this._host,
      port: this._port,
      protocol: 'http',
      auth: {
        user: this._user,
        pass: this._password 
      }
    });
  }

  get initialized(): boolean {
    return this._initialized;
  }

  async getItem(key: StoreKey) : Promise<StoreValue | null> {
    await this.initialize();
    checkStoreKey(key);
    let result;
    try {
      result = await this._couchDb.get(this._database, key);
    }
    catch (error: any) {
      if (error.code === 'EDOCMISSING')
        return null;
      throw new Error(error);
    }
    const value = result.data.value;
    value.storeData = {
      couchDbId: result.data._id,
      couchDbRev: result.data._rev 
    };
    return value;
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
      const result = await this._couchDb.insert(this._database, {
        '_id': key,
        'value':value 
      });
      if (result.data === undefined)
          throw new Error("CouchDb data not set");
      value.storeData = {
        couchDbId: result.data.id,
        couchDbRev: result.data.rev 
      };
    }
    catch (exception:any) {
      if (exception.code === 'EDOCCONFLICT')
        throw new Error(`Element «${key}» already exists`)
      throw new Error(exception.message);
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
      const result = await this._couchDb.update(this._database, {
        '_id':  value.storeData.couchDbId,
        '_rev': value.storeData.couchDbRev,
        'value':value 
      });
      if (result.data === undefined)
          throw new Error("CouchDb data not set");
      value.storeData = {
        couchDbId: result.data.id,  // FIXME pourquoi «id» et pas «_id» ?
        couchDbRev: result.data.rev // FIXME pourquoi «rev» et pas «_rev» ?
      };
    }
    catch (exception:any) {
      if (exception.code === 'EDOCCONFLICT')
        throw new Error(`Element «${key}» already exists`)
      throw new Error(exception.message);
    }
  }


};

export { CouchDbStore };
