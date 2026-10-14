/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { StoreKey, StoreValue } from "../src/store/MaestrozoStore";
import { RawMemoryStore } from "../src/store/RawMemoryStore";
import { ElementName, ElementPath, MtzElement } from "@/Element";

describe("Raw memory store", () => {

  let rawMemoryStore: RawMemoryStore;

  it("should instanciate raw memory store", () => {
    rawMemoryStore = new RawMemoryStore();
  });

  it("should write a value", async () => {
    await rawMemoryStore.createItem('abc' as StoreKey, 'ABC' as StoreValue);
  });

  it("should read an existing value from store", async () => {
    const value = await rawMemoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('ABC');
  });

  it("should change an existing value", async () => {
    await rawMemoryStore.updateItem('abc' as StoreKey, 'A_B_C' as StoreValue);
  });

  it("should retrieve modified value store", async () => {
    const value = await rawMemoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('A_B_C');
  });

  it("should write another value", async () => {
    await rawMemoryStore.createItem('def' as StoreKey, 'D_E_F' as StoreValue);
  });

  it("should retrieve new value from store", async () => {
    const value = await rawMemoryStore.getItem('def' as StoreKey);
    expect(value).to.equal('D_E_F');
  });

  it("should retrieve first value from store", async () => {
    const value = await rawMemoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('A_B_C');
  });


  it("should write an object", async () => {
    await rawMemoryStore.createItem('obj1' as StoreKey, {
      'p1': 'V1',
      'p2': 'V2'
    });
  });

  it("should read this object", async () => {
    const obj = await rawMemoryStore.getItem('obj1' as StoreKey);
    expect(obj).to.be.instanceOf(Object);
    expect(obj).to.deep.equal({
      'p1': 'V1',
      'p2': 'V2'
    });
  });

  it("should write an object with functions", async () => {
    await rawMemoryStore.createItem('obj2' as StoreKey, {
      'p1': 'X1',
      'p2': 'X2',
      'f1': () => true,
      'f2': () => false
    });
  });

  it("should read this object with its functions", async () => {
    const obj = await rawMemoryStore.getItem('obj2' as StoreKey);
    expect(obj).to.be.instanceOf(Object);
    expect(obj).to.have.property('p1', 'X1');
    expect(obj).to.have.property('p2', 'X2');
    expect(obj).to.have.property('f1');
    expect(obj.f1).to.be.a('function');
    expect(obj).to.have.property('f2');
    expect(obj.f1()).to.equal(true);
    expect(obj.f2).to.be.a('function');
    expect(obj.f2()).to.equal(false);
  });


  it("should not write a value with an undefined key", async () => {
    await expect(
      rawMemoryStore.createItem(undefined as any as StoreKey, 'ABC' as StoreValue)
    ).rejects.toThrow("Store key must be defined");
  });

  it("should not write a value with an empty key", async () => {
    await expect(
      rawMemoryStore.createItem('' as StoreKey, 'ABC' as StoreValue)
    ).rejects.toThrow("Store key could not be empty");
  });

  it("should not write a value with an undefined value", async () => {
    await expect(
      rawMemoryStore.createItem('abc' as StoreKey, undefined as StoreValue)
    ).rejects.toThrow("Store value must be defined");
  });

  it("should not read a value with an undefined key", async () => {
    await expect(
      rawMemoryStore.getItem(undefined as any as StoreKey)
    ).rejects.toThrow("Store key must be defined");
  });

  it("should not read an undefined value with an undefined key", async () => {
    await expect(
      rawMemoryStore.getItem(undefined as any as StoreKey)
    ).rejects.toThrow("Store key must be defined");
  });

  it("should not read a value with an empty key", async () => {
    await expect(
      rawMemoryStore.getItem('' as StoreKey)
    ).rejects.toThrow("Store key could not be empty");
  });

  it("should store a new element with functions in data", async () => {
    const element: MtzElement = {
      elementName: 'element-1' as ElementName,
      parentPath: [ '#' ] as ElementPath,
      revision: 1,
      elementType: [ '#', 'types', 'xxx' ] as ElementPath,
      isContainer: false,
      isVolatile: false,
      data: {
        value: 'abc',
        function1: ()=> "F1",
        function2: ()=> "F2",
      },
      childNames: null
    };
    await rawMemoryStore.setElement(element);
  });

  it("should retrieve the newly stored element", async () => {
    const element = await rawMemoryStore.getElement([ '#', 'element-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('elementName', 'element-1');
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('data');
    assert(element.data !== null);
    expect(element.data).to.have.property('value', 'abc');

    expect(element.data).to.have.property('function1');
    expect(element.data.function1).to.be.instanceOf(Function);
    expect(element.data.function1()).to.equal('F1');

    expect(element.data).to.have.property('function2');
    expect(element.data.function2).to.be.instanceOf(Function);
    expect(element.data.function2()).to.equal('F2');
  });

  it("should change an element with functions in data", async () => {
    const element = await rawMemoryStore.getElement([ '#', 'element-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.have.property('data');
    assert(element.data !== null);
    element.revision++;
    element.data.value = 'ABC';
    element.data.function1 = ()=> "f1";
    await rawMemoryStore.setElement(element);
    expect(element).to.have.property('revision', 2);
  });

  it("should retrieve the changed element", async () => {
    const element = await rawMemoryStore.getElement([ '#', 'element-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('elementName', 'element-1');
    expect(element).to.have.property('revision', 2);
    expect(element).to.have.property('data');
    assert(element.data !== null);
    expect(element.data).to.have.property('value', 'ABC');

    expect(element.data).to.have.property('function1');
    expect(element.data.function1).to.be.instanceOf(Function);
    expect(element.data.function1()).to.equal('f1');

    expect(element.data).to.have.property('function2');
    expect(element.data.function2).to.be.instanceOf(Function);
    expect(element.data.function2()).to.equal('F2');
  });

});
