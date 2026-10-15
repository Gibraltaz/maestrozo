/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { ElementData } from 'maestrozo-kernel';
import { MemoryStore } from 'maestrozo-kernel';

import { MtzTree } from "../src/Tree";
import { BuildElementDataCallback, BuildElementDataFunction, BuildElementDataHelpers } from "../src/typeHandlers/elementTypeHandler";
import { ElementName, ElementPath } from "@/Element";

const customElementBuildElementDataFunction1: BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  params:Record<string, any>,
  _helpers: BuildElementDataHelpers
): Promise<ElementData> => {
  return {
    prop1: `abc-${params.i}`,
    prop2: `def-${params.j}`
  } as ElementData;
};


describe("Custom element", () => {
  const tree = new MtzTree();

  it("should initialize tree", async () => {
    await tree.initialize(new MemoryStore());
    expect(tree).to.have.property('initialized', true)
  });

  it("should declare a custom element type", async () => {
    await tree.declareType({
      elementName: 'custom-element-A' as ElementName,
      parentPath: [ '#', 'types'] as ElementPath,
      elementType: [ '#', 'types', 'type' ] as ElementPath,
      isDerivable: false,
      isContainer: false,
      isVolatile: true,
      callbacks: [
        { name: BuildElementDataCallback, function: customElementBuildElementDataFunction1 },
      ]
    });
  });

  it("should find custom element type as a children of /types", async () => {
    const element = await tree.getElement(['#', 'types'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('childNames');
    expect(element.childNames).not.to.equal(null);
    expect(element.childNames).to.deep.include('custom-element-A');
  });

  it("should find /types/element/custom-element-A", async () => {
    const element = await tree.getElement(['#', 'types', 'custom-element-A'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'custom-element-A');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should create a first instance of custom element", async () => {
    const element = await tree.createElement(
      'element-A-1' as ElementName,
      [ '#' ] as ElementPath,
      [ '#', 'types', 'custom-element-A' ] as ElementPath,
      { i: 1, j:2 }
    );
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'element-A-1');

    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ '#', 'types', 'custom-element-A' ]);

    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);

    expect(element).to.have.property('data');
    expect(element.data).not.to.equal(null);
    expect(element.data).to.have.property('prop1', 'abc-1'); // i=1
    expect(element.data).to.have.property('prop2', 'def-2'); // j=2
  });

  it("should create a second instance of custom element", async () => {
    const element = await tree.createElement(
      'element-A-2' as ElementName,
      [ '#' ] as ElementPath,
      [ '#', 'types', 'custom-element-A' ] as ElementPath,
      { i: 3, j:4 }
    );
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'element-A-2');

    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ '#', 'types', 'custom-element-A' ]);

    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);

    expect(element).to.have.property('data');
    expect(element.data).not.to.equal(null);
    expect(element.data).to.have.property('prop1', 'abc-3'); // i=3
    expect(element.data).to.have.property('prop2', 'def-4'); // j=4
  });

  it("should find the first instance", async () => {
    const element = await tree.getElement([ '#', 'element-A-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'element-A-1');
    expect(element).to.have.property('revision', 1);
  });

  it("should find the second instance", async () => {
    const element = await tree.getElement([ '#', 'element-A-2' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'element-A-2');
    expect(element).to.have.property('revision', 1);
  });

  it("should find custom element instances as children of root element", async () => {
    const element = await tree.getElement(['#'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('childNames');
    expect(element.childNames).not.to.equal(null);
    expect(element.childNames).to.deep.include('element-A-1');
    expect(element.childNames).to.deep.include('element-A-2');
  });

});



