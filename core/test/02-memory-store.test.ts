/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { StoreKey, StoreValue } from "../src/store/MaestrozoStore";
import { MemoryStore } from "../src/store/MemoryStore";
import { ElementName, ElementPath, MtzElement } from "../src/Element";

describe("Memory store", () => {

  let memoryStore: MemoryStore;

  it("should instanciate  memory store", () => {
    memoryStore = new MemoryStore();
  });

  it("should write a value", async () => {
    await memoryStore.createItem('abc' as StoreKey, 'ABC' as StoreValue);
  });

  it("should read an existing value from store", async () => {
    const value = await memoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('ABC');
  });

  it("should change an existing value", async () => {
    await memoryStore.updateItem('abc' as StoreKey, 'A_B_C' as StoreValue);
  });

  it("should retrieve modified value store", async () => {
    const value = await memoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('A_B_C');
  });

  it("should write another value", async () => {
    await memoryStore.createItem('def' as StoreKey, 'D_E_F' as StoreValue);
  });

  it("should retrieve new value from store", async () => {
    const value = await memoryStore.getItem('def' as StoreKey);
    expect(value).to.equal('D_E_F');
  });

  it("should retrieve first value from store", async () => {
    const value = await memoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('A_B_C');
  });

  it("should write an object", async () => {
    await memoryStore.createItem('obj1' as StoreKey, {
      'p1': 'V1',
      'p2': 'V2'
    });
  });

  it("should read this object", async () => {
    const obj = await memoryStore.getItem('obj1' as StoreKey);
    expect(obj).to.be.instanceOf(Object);
    expect(obj).to.deep.equal({
      'p1': 'V1',
      'p2': 'V2'
    });
  });

  it("should write an object with functions", async () => {
    await memoryStore.createItem('obj2' as StoreKey, {
      'p1': 'X1',
      'p2': 'X2',
      'f1': () => true,
      'f2': () => false 
    });
  });

  it("should read this object", async () => {
    const obj = await memoryStore.getItem('obj2' as StoreKey);
    expect(obj).to.be.instanceOf(Object);
    expect(obj).to.deep.equal({
      'p1': 'X1',
      'p2': 'X2'
    });
    expect(obj).not.to.have.property('f1');
    expect(obj).not.to.have.property('f2');
  });


  describe("Item creation function", () => {

    it("should detect creation conflict on existing object", async () => {
      await expect(
        memoryStore.createItem('abc' as StoreKey, 'ABC' as StoreValue)
      ).rejects.toThrow("Item «abc» already exists");
    });

    it("should not create a value with an undefined key", async () => {
      await expect(
        memoryStore.createItem(undefined as any as StoreKey, 'ABC' as StoreValue)
      ).rejects.toThrow("Store key must be defined");
    });

    it("should not create a value with an empty key", async () => {
      await expect(
        memoryStore.createItem('' as StoreKey, 'ABC' as StoreValue)
      ).rejects.toThrow("Store key could not be empty");
    });

    it("should not create a value with an undefined value", async () => {
      await expect(
        memoryStore.createItem('abc' as StoreKey, undefined as StoreValue)
      ).rejects.toThrow("Store value must be defined");
    });
  });

  describe("Item update function", () => {

    it("should detect non existing object", async () => {
      await expect(
        memoryStore.updateItem('zzz' as StoreKey, 'ABC' as StoreValue)
      ).rejects.toThrow("Item «zzz» does not exist");
    });


    it("should not update a value with an undefined key", async () => {
      await expect(
        memoryStore.updateItem(undefined as any as StoreKey, 'ABC' as StoreValue)
      ).rejects.toThrow("Store key must be defined");
    });

    it("should not update a value with an empty key", async () => {
      await expect(
        memoryStore.updateItem('' as StoreKey, 'ABC' as StoreValue)
      ).rejects.toThrow("Store key could not be empty");
    });

    it("should not update a value with an undefined value", async () => {
      await expect(
        memoryStore.updateItem('abc' as StoreKey, undefined as StoreValue)
      ).rejects.toThrow("Store value must be defined");
    });
  });

  describe("Item get function", () => {
    it("should not read a value with an undefined key", async () => {
      await expect(
        memoryStore.getItem(undefined as any as StoreKey)
      ).rejects.toThrow("Store key must be defined");
    });

    it("should not read an undefined value with an undefined key", async () => {
      await expect(
        memoryStore.getItem(undefined as any as StoreKey)
      ).rejects.toThrow("Store key must be defined");
    });

    it("should not read a value with an empty key", async () => {
      await expect(
        memoryStore.getItem('' as StoreKey)
      ).rejects.toThrow("Store key could not be empty");
    });
  });


  it("should store a new element", async () => {
    const element: MtzElement = {
      elementName: 'element-1' as ElementName,
      parentPath: [ '#' ] as ElementPath,
      revision: 1,
      elementType: [ '#', 'types', 'xxx' ] as ElementPath,
      isContainer: false,
      isVolatile: false,
      data: { value: 'abc' },
      childNames: null
    };
    await memoryStore.setElement(element);
  });

  it("should retrieve newly stored element", async () => {
    const element = await memoryStore.getElement([ '#', 'element-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('elementName', 'element-1');
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('data');
    expect(element.data).to.have.property('value', 'abc');
  });

  it("should update newly stored element", async () => {
    const element = await memoryStore.getElement([ '#', 'element-1' ] as ElementPath);
    assert(element !== null);
    assert(element.data !== null);
    element.data.value = 'ABC';
    element.revision++;
    await memoryStore.setElement(element);
    expect(element.revision).to.equal(2);
  });

  it("should retrieve change in element", async () => {
    const element = await memoryStore.getElement([ '#', 'element-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('elementName', 'element-1');
    expect(element).to.have.property('revision', 2);
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('data');
    expect(element.data).to.have.property('value', 'ABC');
  });

  it("should not find an non existent element", async () => {
    const element = await memoryStore.getElement([ '#', 'non-existent-element' ] as ElementPath);
    expect(element).to.equal(null);
  });

});
