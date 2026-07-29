/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MtzEngine, ElementName, ElementPath } from "@/Engine";
import { BuildDataFunction, BuildElementFunction, BuildHelpers } from "@/typeHandlers/TypeHandler";
import { ElementData, MtzElement } from "@/Element";
import { MemoryStore } from "@/store/MemoryStore";

const customComponentBuildDataFunction: BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildHelpers
): Promise<ElementData> => {
  throw new Error("not yet implemented");
};

const customComponentBuildElementFunction: BuildElementFunction = async (
  _element: MtzElement,
  _params:Record<string, any>,
  _helpers: BuildHelpers
):Promise<void> => {
}

describe("Maestrozo engine", () => {
  const engine = new MtzEngine();

  it("should be initialized", async () => {
    await engine.initialize(new MemoryStore());
    expect(engine).to.have.property('initialized', true)
  });

  it("should declare a custom component", async () => {
    await engine.declareType({
      elementName: 'custom-component' as ElementName,
      parentPath: [ 
        '#' as ElementName,
        'types' as ElementName, 
        'components' as ElementName
      ],
      elementType: [ 
        '#' as ElementName,
        'types' as ElementName, 
        'type' as ElementName
      ],
      isDerivable: false,
      isContainer: false,
      isVolatile: true,
      buildDataFunction: customComponentBuildDataFunction,
      buildElementFunction: customComponentBuildElementFunction
    });

  });

  it("should find custom component type in /types/components", async () => {
    const element = await engine.getElement(['#', 'types', 'components'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(['constant', 'variable', 'custom-component']);
  });

  it("should find /types/components/custom-component", async () => {
    const element = await engine.getElement(['#', 'types', 'components', 'custom-component'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'custom-component');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'components']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

});
