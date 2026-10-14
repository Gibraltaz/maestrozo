/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from 'vitest';
import nconf from 'nconf';

import { CouchDbStore } from '../src/CouchDbStore.js';
import { StoreKey } from "maestrozo-core";
import { ElementName, ElementPath, MtzElement } from 'node_modules/maestrozo-core/dist/Element.js';


const loadConfig = () => {
  return nconf.file({ file: 'config.json'});
};


describe("Maestrozo CouchDB store", () => {
  let couchDbStore: CouchDbStore | null = null;

  const newItemKey = `/#-${Date.now()}`  as StoreKey;
  const firstElementName = `element-${Date.now()}`  as StoreKey;

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

  it("should retrieve changed item", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const item = await couchDbStore.getItem(newItemKey);
    expect (item).to.be.instanceOf(Object);
    expect (item).to.have.property('name', 'ABC');
    expect (item).to.have.property('age', 2);
    expect (item).to.have.property('storeData');
    expect (item.storeData).to.be.instanceOf(Object);
    expect (item.storeData).to.have.property('couchDbId', newItemKey);
    expect (item.storeData).to.have.property('couchDbRev');
  });

  it("should not find non existent key", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const obj = await couchDbStore.getItem('NON_EXISTENT_KEY' as StoreKey);
    expect(obj).to.equal(null);
  });

  it("should store a new element", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const element: MtzElement = {
      elementName: firstElementName as ElementName,
      parentPath: [ '#' ] as ElementPath,
      revision: 1,
      elementType: [ '#', 'types', 'xxx' ] as ElementPath,
      isContainer: false,
      isVolatile: false,
      data: { value: 'abc' },
      childNames: null
    };
    await couchDbStore.setElement(element);
  });

  it("should retrieve newly stored element", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const element = await couchDbStore.getElement([ '#', firstElementName ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('elementName', firstElementName);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('data');
    expect(element.data).to.have.property('value', 'abc');
  });

  it("should update newly stored element", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const element = await couchDbStore.getElement([ '#', firstElementName ] as ElementPath);
    assert(element !== null);
    assert(element.data !== null);
    element.data.value = 'ABC';
    element.revision++;
    await couchDbStore.setElement(element);
    expect(element.revision).to.equal(2);
  });

  it("should retrieve change in element", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const element = await couchDbStore.getElement([ '#', firstElementName ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('elementName', firstElementName);
    expect(element).to.have.property('revision', 2);
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('data');
    expect(element.data).to.have.property('value', 'ABC');
  });

  it("should not find an non existent element", async ({skip}) => {
    skip(couchDbStore === null, "Store not initialized");
    assert(couchDbStore !== null);
    const element = await couchDbStore.getElement([ '#', 'non-existent-element' ] as ElementPath);
    expect(element).to.equal(null);
  });

});
