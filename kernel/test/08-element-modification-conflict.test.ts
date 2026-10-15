/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { ElementData, MtzElement } from 'maestrozo-kernel';
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
  let element1: MtzElement | null = null;
  let element2: MtzElement | null = null;

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
      isVolatile: false,
      callbacks: [
        { name: BuildElementDataCallback, function: customElementBuildElementDataFunction1 },
      ]
    });
  });


  it("should instanciate custom element", async () => {
    element1 = await tree.createElement(
      'element-A-1' as ElementName,
      [ '#' ] as ElementPath,
      [ '#', 'types', 'custom-element-A' ] as ElementPath,
      { p1: 111 }
    );
    expect(element1).to.be.instanceof(Object);
    expect(element1).to.have.property('revision', 1);
    expect(element1).to.have.property('elementName', 'element-A-1');

    expect(element1).to.have.property('data');
    expect(element1.data).not.to.equal(null);
    expect(element1.data).to.have.property('p1', 111);
  });


  it("should get a first reference on custom element", async () => {
    element1 = await tree.getElement([ '#', 'element-A-1' ] as ElementPath);
    expect(element1).not.to.equal(null);
    assert(element1 !== null);
    expect(element1).to.be.instanceof(Object);
    expect(element1).to.have.property('elementName', 'element-A-1');
  });

  it("should get a second reference on custom element", async () => {
    element2 = await tree.getElement([ '#', 'element-A-1' ] as ElementPath);
    expect(element2).not.to.equal(null);
    assert(element2 !== null);
    expect(element2).to.be.instanceof(Object);
    expect(element2).to.have.property('elementName', 'element-A-1');
  });

  it("should have two differents references with same content", async ({skip}) => {
    skip(element1 === null || element2 === null);
    expect(element1).not.to.equal(element2);
    //expect(element1).to.deep.equal(element2);
  });

  it("should change element data with first reference", async ({skip}) => {
    skip(element1 === null);
    assert(element1 !== null);
    assert(element1.data !== null);
    element1.data.p1 = 112;

    await tree.modifyElement(element1);

    expect(element1).to.have.property('data');
    expect(element1.data).not.to.equal(null);
    expect(element1.data).to.have.property('p1', 112);

    expect(element1).to.have.property('revision', 2);
  });

  it("should detect conflict when trying to change data with second reference", async ({skip}) => {
    skip(element2 === null);
    assert(element2 !== null);
    assert(element2.data !== null);
    element2.data.p1 = 114;

    await expect( async() => {
      assert(element2 !== null);
      await tree.modifyElement(element2);
    }).rejects.toThrow("Conflict in edition of element «/#/element-A-1»");

    expect(element2).to.have.property('revision', 1);

    expect(element2).to.have.property('data');
    expect(element2.data).not.to.equal(null);
    expect(element2.data).to.have.property('p1', 114);
  });

  it("should retrieve value stored before conflict", async () => {
    const element = await tree.getElement([ '#', 'element-A-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'element-A-1');

    expect(element).to.have.property('revision', 2);

    expect(element).not.to.equal(element1);
    expect(element).not.to.equal(element2);

    expect(element).to.have.property('data');
    expect(element.data).not.to.equal(null);
    expect(element.data).to.have.property('p1', 112);
  });

});



