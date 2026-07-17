/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { StoreKey, StoreValue } from "@/store/MaestrozoStore";
import { RawMemoryStore } from "@/store/RawMemoryStore";

describe("Raw memory store", () => {

  let rawMemoryStore: RawMemoryStore;

  it("should instanciate raw memory store", () => {
    rawMemoryStore = new RawMemoryStore();
  });

  it("should write a value", async () => {
    await rawMemoryStore.setItem('abc' as StoreKey, 'ABC' as StoreValue);
  });

  it("should read an existing value from store", async () => {
    const value = await rawMemoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('ABC');
  });

  it("should change an existing value", async () => {
    await rawMemoryStore.setItem('abc' as StoreKey, 'A_B_C' as StoreValue);
  });

  it("should retrieve modified value store", async () => {
    const value = await rawMemoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('A_B_C');
  });

  it("should write another value", async () => {
    await rawMemoryStore.setItem('def' as StoreKey, 'D_E_F' as StoreValue);
  });

  it("should retrieve new value from store", async () => {
    const value = await rawMemoryStore.getItem('def' as StoreKey);
    expect(value).to.equal('D_E_F');
  });

  it("should retrieve first value from store", async () => {
    const value = await rawMemoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('A_B_C');
  });

  it("should not write a value with an undefined key", async () => {
    await expect(
      rawMemoryStore.setItem(undefined as any as StoreKey, 'ABC' as StoreValue)
    ).rejects.toThrow("Store key must be defined");
  });

  it("should not write a value with an empty key", async () => {
    await expect(
      rawMemoryStore.setItem('' as StoreKey, 'ABC' as StoreValue)
    ).rejects.toThrow("Store key could not be empty");
  });

  it("should not write a value with an undefined value", async () => {
    await expect(
      rawMemoryStore.setItem('abc' as StoreKey, undefined as StoreValue)
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

});
