/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MtzEngine, ElementName, ElementPath } from "@/Engine";
import { ElementData, MtzElement } from "@/Element";
import { MemoryStore } from "@/store/MemoryStore";
//import { BuildComponentCallback, BuildComponentFunction, BuildComponentHelpers } from "@/typeHandlers/containerTypeHandler";
import { BuildElementDataCallback, BuildElementDataFunction, BuildElementDataHelpers, InitializeElementCallback, InitializeElementFunction } from "@/typeHandlers/elementTypeHandler";
import { MtzElementCapabilities } from "@/elementCapabilities";

let capabilities: MtzElementCapabilities|null = null;

const customContainerBuildElementDataFunction: BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildElementDataHelpers
): Promise<ElementData> => {
  return {} as ElementData;
};

const customContainerInitializeFunction : InitializeElementFunction = async (
  element: MtzElement,
  elementCapabilities: MtzElementCapabilities
): Promise <void> => {
  if (element.elementName === 'C1')
    capabilities = elementCapabilities;
};

describe("Element capabilities", () => {
  const engine = new MtzEngine();

  it("should initialize engine", async () => {
    await engine.initialize(new MemoryStore());
    expect(engine).to.have.property('initialized', true)
  });

  it("should declare a custom container", async () => {
    await engine.declareType({
      elementName: 'custom-container-A' as ElementName,
      parentPath: [ '#', 'types', 'container' ] as ElementPath,
      elementType: [ '#', 'types', 'type' ] as ElementPath,
      isDerivable: false,
      isContainer: true,
      isVolatile: true,
      callbacks: [
        { name: BuildElementDataCallback,  function: customContainerBuildElementDataFunction },
        { name: InitializeElementCallback, function: customContainerInitializeFunction },
      ]
    });
  });

  it("should create a custom container", async () => {
    await engine.createElement(
      'C1' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'container', 'custom-container-A' ] as ElementPath,
      {}
    );
  });

  it("should create a custom container child", async () => {
    await engine.createElement(
      'E1' as ElementName,
      [ '#', 'runtime', 'C1' ] as ElementPath,
      [ '#', 'types', 'container', 'custom-container-A' ] as ElementPath,
      {}
    );
  });


  it("should have found capabilities with element creation", async ({skip}) => {
    skip(capabilities === null, "Capacities not initialized");
    expect(capabilities).to.be.instanceof(Object);
    expect(capabilities).to.have.all.keys(
      'getPath',
      'getChild',
      'getParent',
      'getElement',
      'scheduleEvaluation'
    );
  });

  it("should get capabilities with get element function", async ({skip}) => {
    skip(capabilities === null, "Capacities not initialized");
    assert(capabilities !== null);
    const originalCapabilities = capabilities;
    capabilities = null;
    await originalCapabilities.getElement([ '#', 'runtime', 'C1' ] as ElementPath);
    expect(capabilities).to.be.instanceof(Object);
    expect(capabilities).to.have.all.keys(
      'getPath',
      'getChild',
      'getParent',
      'getElement',
      'scheduleEvaluation'
    );
  });
  it("should get element path with capabilities", async ({skip}) => {
    skip(capabilities === null, "Capacities not initialized");
    expect(capabilities).not.to.equal(null);
    assert(capabilities !== null);
    expect(capabilities.getPath()).to.deep.equal([ '#', 'runtime', 'C1' ]);
  });

  it("should get child with capabilities", async ({skip}) => {
    skip(capabilities === null, "Capacities not initialized");
    expect(capabilities).not.to.equal(null);
    assert(capabilities !== null);
    const child = await capabilities.getChild('E1' as ElementName);
    expect(child).to.be.instanceOf(Object);
    expect(child).have.property('elementName', 'E1');
    if (child === null) throw new Error();
    expect(child.parentPath).have.deep.equal([ '#', 'runtime', 'C1' ]);
  });

  it("should get parent with capabilities", async ({skip}) => {
    skip(capabilities === null, "Capacities not initialized");
    expect(capabilities).not.to.equal(null);
    assert(capabilities !== null);
    const parent = await capabilities.getParent();
    expect(parent).to.be.instanceOf(Object);
    expect(parent).have.property('elementName', 'runtime');
  });

  it("should get element with capabilities", async ({skip}) => {
    skip(capabilities === null, "Capacities not initialized");
    assert(capabilities !== null);
    const element = await capabilities.getElement([ '#', 'runtime'] as ElementPath);
    expect(element).to.be.instanceOf(Object);
    expect(element).have.property('elementName', 'runtime');
  });

  it("should schedule evaluation with capabilities", async ({skip}) => {
    skip(capabilities === null, "Capacities not initialized");
    assert(capabilities !== null);
    // TODO à terminer
    await capabilities.scheduleEvaluation(0);
  });


});

