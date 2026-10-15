/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { MemoryStore } from "../src/store/MemoryStore";
import { ElementName, ElementPath, MtzElement } from "../src/Element";

describe("Memory store", () => {

  let memoryStore: MemoryStore;

  it("should instanciate  memory store", () => {
    memoryStore = new MemoryStore();
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
