/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { StoreKey, StoreValue } from "@/store/MaestrozoStore";
import { MemoryStore } from "@/store/MemoryStore";

describe("Memory store", () => {

  let memoryStore: MemoryStore;

  it("should instanciate  memory store", () => {
    memoryStore = new MemoryStore();
  });

  it("should write a value", async () => {
    await memoryStore.setItem('abc' as StoreKey, 'ABC' as StoreValue);
  });


  it("should read an existing value from store", async () => {
    const value = await memoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('ABC');
  });

  it("should change an existing value", async () => {
    await memoryStore.setItem('abc' as StoreKey, 'A_B_C' as StoreValue);
  });

  it("should retrieve modified value store", async () => {
    const value = await memoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('A_B_C');
  });

  it("should write another value", async () => {
    await memoryStore.setItem('def' as StoreKey, 'D_E_F' as StoreValue);
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
    await memoryStore.setItem('obj1' as StoreKey, {
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
    await memoryStore.setItem('obj2' as StoreKey, {
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


  it("should not write a value with an undefined key", async () => {
    await expect(
      memoryStore.setItem(undefined as any as StoreKey, 'ABC' as StoreValue)
    ).rejects.toThrow("Store key must be defined");
  });

  it("should not write a value with an empty key", async () => {
    await expect(
      memoryStore.setItem('' as StoreKey, 'ABC' as StoreValue)
    ).rejects.toThrow("Store key could not be empty");
  });

  it("should not write a value with an undefined value", async () => {
    await expect(
      memoryStore.setItem('abc' as StoreKey, undefined as StoreValue)
    ).rejects.toThrow("Store value must be defined");
  });

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
