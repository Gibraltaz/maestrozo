/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { ElementPath, MemoryStore } from '@maestrozo/kernel';

import { MtzTree } from "../src/Tree";


describe("Maestrozo core", () => {
  let tree = new MtzTree()

  it("should be initialized", async () => {
    await tree.initialize(new MemoryStore());
    expect(tree).to.have.property('initialized', true)
  });

  it("should find root «/» element", async () => {
    const element = await tree.getElement(['#'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 2);
    expect(element).to.have.property('elementName', '#');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([]);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'container']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', false);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(['types']);
  });

  it("should find /types element", async () => {
    const element = await tree.getElement(['#', 'types'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 4);
    expect(element).to.have.property('elementName', 'types');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'container']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal([ 'type', 'element', 'container' ]);
  });

  it("should find /types/type", async () => {
    const element = await tree.getElement(['#', 'types', 'type'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'type');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });


  it("should find /types/element", async () => {
    const element = await tree.getElement(['#', 'types', 'element'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'element');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/container", async () => {
    const element = await tree.getElement(['#', 'types', 'container'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'container');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal([]);
  });

});
