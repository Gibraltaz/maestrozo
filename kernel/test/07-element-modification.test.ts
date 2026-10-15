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
    p1: params.p1,
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


  it("should instanciate custom element", async () => {
    const element = await tree.createElement(
      'element-A-1' as ElementName,
      [ '#' ] as ElementPath,
      [ '#', 'types', 'custom-element-A' ] as ElementPath,
      { p1: 111 }
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
    expect(element.data).to.have.property('p1', 111);
  });


  it("should find the custom element with revision 1", async () => {
    const element = await tree.getElement([ '#', 'element-A-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'element-A-1');
    expect(element).to.have.property('revision', 1);

    expect(element).to.have.property('data');
    expect(element.data).not.to.equal(null);
    expect(element.data).to.have.property('p1', 111);
  });

  it("should change the custom element data", async () => {
    const element = await tree.getElement([ '#', 'element-A-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'element-A-1');

    expect(element).to.have.property('data');
    assert(element.data !== null);
    expect(element.data).not.to.equal(null);
    expect(element.data).to.have.property('p1', 111);

    element.data.p1 = 222;

    await tree.modifyElement(element);

    expect(element).to.have.property('data');
    expect(element.data).not.to.equal(null);
    expect(element.data).to.have.property('p1', 222);

    expect(element).to.have.property('revision', 2);
  });

  it("should find the updated custom element with revision 2", async () => {
    const element = await tree.getElement([ '#', 'element-A-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'element-A-1');

    expect(element).to.have.property('revision', 2);

    expect(element).to.have.property('data');
    expect(element.data).not.to.equal(null);
    expect(element.data).to.have.property('p1', 222);
  });


});



