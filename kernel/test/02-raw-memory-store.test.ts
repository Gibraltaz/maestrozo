/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { RawMemoryStore } from "../src/store/RawMemoryStore";
import { ElementName, ElementPath, MtzElement } from "@/Element";

describe("Raw memory store", () => {

  let rawMemoryStore: RawMemoryStore;

  it("should instanciate raw memory store", () => {
    rawMemoryStore = new RawMemoryStore();
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
