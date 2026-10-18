/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import Nano from 'nano';

import {
  ElementPath, MtzElement,
  checkStoreValue, getElementPath, MaestrozoStore, pathToString
} from '@maestrozo/kernel';

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


  async getElement(elementPath: ElementPath): Promise<MtzElement | null> {
    await this.initialize();
    const storeKey = pathToString(elementPath);
    try {
      const result = await this._db.get(storeKey);
      if (! result.value)
        throw new Error("CouchDb value not found");
      const couchDbId = result._id;
      const couchDbRev = result._rev;
      if (couchDbId === undefined)
          throw new Error("CouchDb id not set");
      if (couchDbRev === undefined)
          throw new Error("CouchDb rev not set");
      const element = result.value as MtzElement;
      element.storeData = { couchDbId, couchDbRev };
      return element;
    }
    catch (error: any) {
      if (error.error === 'not_found')
        return null;
      throw new Error(`CouchDB get error : ${error.description}`);
    }
  }

  async setElement(element: MtzElement): Promise<void> {
    await this.initialize();
    const elementPath = getElementPath(element);
    const storeKey = pathToString(elementPath);
    //checkStoreKey(storeKey);
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

    if (element.revision === 1) {

      try {
        const result = await this._db.insert({ value: cleanElement }, storeKey);
        if (! result.ok)
          throw new Error("CouchDb insertion is not OK");
        const couchDbId = result.id;
        const couchDbRev = result.rev;
        if (couchDbId === undefined)
            throw new Error("CouchDb id not set");
        if (couchDbRev === undefined)
            throw new Error("CouchDb rev not set");
        element.storeData = { couchDbId, couchDbRev };
      }
      catch (error:any) {
        if (error.error === 'conflict')
          throw new Error(`Element «${storeKey}» already exists`)
        throw new Error(error.message);
      }
    }
    else {
      //throw new Error(`Element «${storeKey}» does not exist`);
      try {
        if (element.storeData === undefined)
          throw new Error("Store data not set inelement");
        const couchDbId = element.storeData.couchDbId;
        const couchDbRev = element.storeData.couchDbRev;
        if (couchDbId === undefined)
            throw new Error("CouchDb id not set in element store data");
        if (couchDbRev === undefined)
            throw new Error("CouchDb rev not set in element store data");
        const result = await this._db.insert({ _id: couchDbId, _rev: couchDbRev, value: cleanElement });
        if (! result.ok)
          throw new Error("CouchDb update is not OK");
        if (result.id === undefined)
            throw new Error("CouchDb id not set");
        if (result.rev === undefined)
            throw new Error("CouchDb rev not set");
        element.storeData.couchDbRev = result.rev;
      }
      catch (exception:any) {
        if (exception.code === 'EDOCCONFLICT')
          throw new Error(`Element «${storeKey}» already exists`)
        throw new Error(exception.message);
      }
    }
  }
};

export { CouchDbStore };
