/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from 'vitest';
import nconf from 'nconf';

import { CouchDbStore } from '../src/CouchDbStore.js';
import { StoreKey } from "maestrozo-core";


const loadConfig = () => {
  return nconf.file({ file: 'config.json'});
};


describe("Maestrozo CouchDB store", () => {
  let couchDbStore: CouchDbStore | null = null;
  const newItemKey = "k" + Date.now() as StoreKey;

  const config = loadConfig();

  it("should instanciate store", () => {
    const couchDbHost = config.get("host");
    const couchDbPort = config.get("port");
    const couchDbUser = config.get("user");
    const couchDbPassword = config.get("password");
    const couchDbDatabase = config.get("database");
    couchDbStore = new CouchDbStore(
      couchDbHost,
      couchDbPort,
      couchDbUser,
      couchDbPassword,
      couchDbDatabase
    );
    expect(couchDbStore).to.be.instanceOf(Object);
    expect(couchDbStore).to.be.have.property('_host', couchDbHost);
    expect(couchDbStore).to.be.have.property('_port', couchDbPort);
    expect(couchDbStore).to.be.have.property('_user', couchDbUser);
    expect(couchDbStore).to.be.have.property('_database', couchDbDatabase);
    expect(couchDbStore).to.be.have.property('initialized', false);
  });

  it("should connect database", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const obj = await couchDbStore.getItem('NON_EXISTENT_KEY' as StoreKey);
    expect(obj).to.equal(null);
  });

  it("should create an item", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const item: any = { name: 'ABC', age:1 };
    await couchDbStore.createItem(newItemKey, item );
    expect (item).to.be.instanceOf(Object);
    expect (item).to.have.property('name', 'ABC');
    expect (item).to.have.property('age', 1);
    expect (item).to.have.property('storeData');
    expect (item.storeData).to.be.instanceOf(Object);
    expect (item.storeData).to.have.property('couchDbId', newItemKey);
    expect (item.storeData).to.have.property('couchDbRev');
  });

  it("should retrieve newly created item", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const item = await couchDbStore.getItem(newItemKey);
    expect (item).to.be.instanceOf(Object);
    expect (item).to.have.property('name', 'ABC');
    expect (item).to.have.property('age', 1);
    expect (item).to.have.property('storeData');
    expect (item.storeData).to.be.instanceOf(Object);
    expect (item.storeData).to.have.property('couchDbId', newItemKey);
    expect (item.storeData).to.have.property('couchDbRev');
  });

  it("should update newly created item", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const item = await couchDbStore.getItem(newItemKey);
    const oldRev = item.storeData.couchDbRev;
    item.age++;
    await couchDbStore.updateItem(newItemKey, item);
    expect (item).to.be.instanceOf(Object);
    expect (item).to.have.property('name', 'ABC');
    expect (item).to.have.property('age', 2);
    expect (item).to.have.property('storeData');
    expect (item.storeData).to.be.instanceOf(Object);
    expect (item.storeData).to.have.property('couchDbId', newItemKey);
    expect (item.storeData).to.have.property('couchDbRev');
    const newRev = item.storeData.couchDbRev;
    expect (newRev).not.to.equal(oldRev);
  });



});
