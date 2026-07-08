import { describe, it, expect } from "vitest";

import { StoreKey, StoreValue } from "@/store/MaestrozoStore";
import { RawMemoryStore } from "@/store/RawMemoryStore";

describe("Raw memory store", () => {

  let rawMemoryStore: RawMemoryStore;

  it("should instanciate raw memory store", () => {
    rawMemoryStore = new RawMemoryStore();
  });

  it("should write a value", () => {
    rawMemoryStore.setItem('abc' as StoreKey, 'ABC' as StoreValue);
  });

  it("should read an existing value from store", () => {
    const value = rawMemoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('ABC');
  });

  it("should change an existing value", () => {
    rawMemoryStore.setItem('abc' as StoreKey, 'A_B_C' as StoreValue);
  });

  it("should retrieve modified value store", () => {
    const value = rawMemoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('A_B_C');
  });

  it("should write another value", () => {
    rawMemoryStore.setItem('def' as StoreKey, 'D_E_F' as StoreValue);
  });

  it("should retrieve new value from store", () => {
    const value = rawMemoryStore.getItem('def' as StoreKey);
    expect(value).to.equal('D_E_F');
  });

  it("should retrieve first value from store", () => {
    const value = rawMemoryStore.getItem('abc' as StoreKey);
    expect(value).to.equal('A_B_C');
  });



  it("should not write a value with an undefined key", () => {
    expect( () => {
      // @ts-ignore
      rawMemoryStore.setItem(undefined as StoreKey, 'ABC' as StoreValue);
    }).to.throw("Store key must be defined");
  });

  it("should not write a value with an empty key", () => {
    expect( () => {
      rawMemoryStore.setItem('' as StoreKey, 'ABC' as StoreValue);
    }).to.throw("Store key could not be empty");
  });

  it("should not write a value with an undefined value", () => {
    expect( () => {
      rawMemoryStore.setItem('abc' as StoreKey, undefined as StoreValue);
    }).to.throw("Store value must be defined");
  });



  it("should not read a value with an undefined key", () => {
    expect( () => {
      // @ts-ignore
      rawMemoryStore.getItem(undefined as StoreKey);
    }).to.throw("Store key must be defined");
  });

  it("should not read an undefined value with an undefined key", () => {
    expect( () => {
      // @ts-ignore
      rawMemoryStore.getItem(undefined as StoreKey);
    }).to.throw("Store key must be defined");
  });


  it("should not read a value with an empty key", () => {
    expect( () => {
      rawMemoryStore.getItem('' as StoreKey);
    }).to.throw("Store key could not be empty");
  });

});
