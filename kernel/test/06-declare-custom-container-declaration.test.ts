/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { ElementData, MemoryStore } from '@maestrozo/kernel';

import { MtzTree } from "../src/Tree";
import { BuildElementDataCallback, BuildElementDataFunction, BuildElementDataHelpers } from "../src/typeHandlers/elementTypeHandler";
import { ElementName, ElementPath } from "@/Element";

const customContainerBuildElementDataFunction1: BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildElementDataHelpers
): Promise<ElementData> => {
  return { } as ElementData;
};

const customElementBuildElementDataFunction1: BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildElementDataHelpers
): Promise<ElementData> => {
  return { } as ElementData;
};



describe("Custom element", () => {
  const tree = new MtzTree();

  it("should initialize tree", async () => {
    await tree.initialize(new MemoryStore());
    expect(tree).to.have.property('initialized', true)
  });

  it("should declare a custom container type", async () => {
    await tree.declareType({
      elementName: 'custom-container-A' as ElementName,
      parentPath: [ '#', 'types'] as ElementPath,
      elementType: [ '#', 'types', 'type' ] as ElementPath,
      isDerivable: false,
      isContainer: true,
      isVolatile: true,
      callbacks: [
        { name: BuildElementDataCallback, function: customContainerBuildElementDataFunction1 },
      ]
    });
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

  it("should find custom types as a children of /types", async () => {
    const element = await tree.getElement(['#', 'types'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('childNames');
    expect(element.childNames).not.to.equal(null);
    expect(element.childNames).to.deep.include('custom-container-A');
    expect(element.childNames).to.deep.include('custom-element-A');
  });

  it("should find /types/element/custom-container-A", async () => {
    const element = await tree.getElement(['#', 'types', 'custom-container-A'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'custom-container-A');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
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

  it("should create an instance of custom container", async () => {
    const element = await tree.createElement(
      'container-1' as ElementName,
      [ '#' ] as ElementPath,
      [ '#', 'types', 'custom-container-A' ] as ElementPath,
      { }
    );
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'container-1');

    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ '#', 'types', 'custom-container-A' ]);

    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal([]);

  });


  it("should create a first element in custom container", async () => {
    const element = await tree.createElement(
      'element-1' as ElementName,
      [ '#', 'container-1' ] as ElementPath,
      [ '#', 'types', 'custom-element-A' ] as ElementPath,
      { }
    );
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'element-1');

    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#', 'container-1' ]);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ '#', 'types', 'custom-element-A' ]);

    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });


  it("should create a second element in custom container", async () => {
    const element = await tree.createElement(
      'element-2' as ElementName,
      [ '#', 'container-1' ] as ElementPath,
      [ '#', 'types', 'custom-element-A' ] as ElementPath,
      { }
    );
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'element-2');

    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#', 'container-1' ]);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ '#', 'types', 'custom-element-A' ]);

    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find the first instance", async () => {
    const element = await tree.getElement([ '#', 'container-1', 'element-1' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'element-1');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#', 'container-1']);
    expect(element).to.have.property('revision', 1);
  });

  it("should find the first instance", async () => {
    const element = await tree.getElement([ '#', 'container-1', 'element-2' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'element-2');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([ '#', 'container-1']);
    expect(element).to.have.property('revision', 1);
  });


  it("should find custom element instances as children of root element", async () => {
    const container = await tree.getElement(['#', 'container-1'] as ElementPath);
    expect(container).not.to.equal(null);
    assert(container !== null);
    expect(container).to.be.instanceof(Object);
    expect(container).to.have.property('childNames');
    expect(container.childNames).not.to.equal(null);
    expect(container.childNames).to.deep.include('element-1');
    expect(container.childNames).to.deep.include('element-2');
  });

});



