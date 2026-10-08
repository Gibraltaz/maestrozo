/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MtzEngine, ElementName, ElementPath } from "@/Engine";
import { ElementData, MtzElement } from "@/Element";
import { MemoryStore } from "@/store/MemoryStore";
import { BuildComponentCallback, BuildComponentFunction, BuildComponentHelpers } from "@/typeHandlers/componentTypeHandler";
import { BuildElementDataCallback, BuildElementDataFunction, BuildElementDataHelpers } from "@/typeHandlers/elementTypeHandler";

const customComponentBuildElementDataFunction1: BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildElementDataHelpers
): Promise<ElementData> => {
  return {} as ElementData;
};

const customComponentBuildElementFunction1: BuildComponentFunction = async (
  _element: MtzElement,
  _params:Record<string, any>,
  _helpers: BuildComponentHelpers
): Promise<void> => {
}

describe("Custom component without pin", () => {
  const engine = new MtzEngine();

  it("should initialize engine", async () => {
    await engine.initialize(new MemoryStore());
    expect(engine).to.have.property('initialized', true)
  });

  it("should declare a custom component", async () => {
    await engine.declareType({
      elementName: 'custom-component-A' as ElementName,
      parentPath: [ 
        '#' as ElementName,
        'types' as ElementName, 
        'component' as ElementName
      ],
      elementType: [ 
        '#' as ElementName,
        'types' as ElementName, 
        'type' as ElementName
      ],
      isDerivable: false,
      isContainer: false,
      isVolatile: true,
      callbacks: [
        { name: BuildElementDataCallback, function: customComponentBuildElementDataFunction1 },
        { name: BuildComponentCallback, function: customComponentBuildElementFunction1}
      ]
    });

  });

  it("should find custom component type in /types/component", async () => {
    const element = await engine.getElement(['#', 'types', 'component'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(['composite', 'constant', 'variable', 'custom-component-A']);
  });

  it("should find /types/component/custom-component-A", async () => {
    const element = await engine.getElement(['#', 'types', 'component', 'custom-component-A'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'custom-component-A');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'component']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should create a first instance of custom component", async () => {
    const component = await engine.createElement(
      'component-A-1' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'component', 'custom-component-A' ] as ElementPath,
      {}
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('revision', 1);
    expect(component).to.have.property('elementName', 'component-A-1');

    expect(component).to.have.property('parentPath');
    expect(component.parentPath).to.deep.equal([ '#', 'runtime' ]);
    expect(component).to.have.property('elementType');
    expect(component.elementType).to.deep.equal([ '#', 'types', 'component', 'custom-component-A' ]);

    expect(component).to.have.property('childNames');
    expect(component.childNames).to.deep.equal(null);
  });

  it("should create a second instance of custom component", async () => {
    const component = await engine.createElement(
      'component-A-2' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'component', 'custom-component-A' ] as ElementPath,
      {}
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('revision', 1);
    expect(component).to.have.property('elementName', 'component-A-2');

    expect(component).to.have.property('parentPath');
    expect(component.parentPath).to.deep.equal([ '#', 'runtime' ]);
    expect(component).to.have.property('elementType');
    expect(component.elementType).to.deep.equal([ '#', 'types', 'component', 'custom-component-A' ]);

    expect(component).to.have.property('childNames');
    expect(component.childNames).to.deep.equal(null);
  });


  it("should find first instance", async () => {
    const component = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'component-A-1' as ElementName,
    ]);
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'component-A-1');
    expect(component).to.have.property('revision', 1);
    expect(component).to.have.property('childNames');
    expect(component.childNames).to.deep.equal(null);
  });

  it("should find second instance", async () => {
    const component = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'component-A-2' as ElementName,
    ]);
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'component-A-2');
    expect(component).to.have.property('revision', 1);
    expect(component).to.have.property('childNames');
    expect(component.childNames).to.deep.equal(null);
  });
});


const customComponentBuildElementDataFunction2: BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  params:Record<string, any>,
  _helpers: BuildElementDataHelpers
): Promise<ElementData> => {
  if (params.inValue === undefined)
    throw new Error("Param «inValue» is not defined");
  if (params.outValue === undefined)
    throw new Error("Param «outValue» is not defined");
  return {
    inputValue: params.inValue,
    outputValue: params.outValue,
  } as ElementData;
};

const customComponentBuildElementFunction2: BuildComponentFunction = async (
  element: MtzElement,
  _params:Record<string, any>,
  helpers: BuildElementDataHelpers
): Promise<void> => {
  const inputPinValue = element?.data?.inputValue ?? null;
  const outputPinValue = element?.data?.outputValue ?? null;

  await helpers.createChildElement(
    'in:value' as ElementName,
    [ '#' as ElementName, 'types' as ElementName, 'pins' as ElementName, 'input-pin' as ElementName ],
    { value: inputPinValue }
  );

  await helpers.createChildElement(
    'out:value' as ElementName,
    [ '#' as ElementName, 'types' as ElementName, 'pins' as ElementName, 'output-pin' as ElementName ],
    { value: outputPinValue }
  );
}



describe("Custom component with pins", () => {
  const engine = new MtzEngine();

  it("should initialize engine", async () => {
    await engine.initialize(new MemoryStore());
    expect(engine).to.have.property('initialized', true)
  });

  it("should declare a custom component with pins", async () => {
    await engine.declareType({
      elementName: 'custom-component-B' as ElementName,
      parentPath: [ 
        '#' as ElementName,
        'types' as ElementName, 
        'component' as ElementName
      ],
      elementType: [ 
        '#' as ElementName,
        'types' as ElementName, 
        'type' as ElementName
      ],
      isDerivable: false,
      isContainer: true,
      isVolatile: false,
      callbacks: [
        { name: BuildElementDataCallback, function: customComponentBuildElementDataFunction2 },
        { name: BuildComponentCallback, function: customComponentBuildElementFunction2}
      ]
    });

  });

  it("should find custom component type in /types/component", async () => {
    const element = await engine.getElement(['#', 'types', 'component'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(['composite', 'constant', 'variable', 'custom-component-B']);
  });

  it("should find /types/component/custom-component-B", async () => {
    const element = await engine.getElement(['#', 'types', 'component', 'custom-component-B'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'custom-component-B');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'component']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should create an instance of custom component", async () => {
    const component = await engine.createElement(
      'component-B-1' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'component', 'custom-component-B' ] as ElementPath,
      {
        inValue: 123,
        outValue: 456
      }
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('revision', 1);
    expect(component).to.have.property('elementName', 'component-B-1');

    expect(component).to.have.property('parentPath');
    expect(component.parentPath).to.deep.equal([ '#', 'runtime' ]);
    expect(component).to.have.property('elementType');
    expect(component.elementType).to.deep.equal([ '#', 'types', 'component', 'custom-component-B' ]);

    expect(component).to.have.property('childNames');
    expect(component.childNames).to.deep.equal([ 'in:value', 'out:value' ]);
  });

  it("should find instance", async () => {
    const component = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'component-B-1' as ElementName,
    ]);
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'component-B-1');
    expect(component).to.have.property('revision', 1);
    expect(component).to.have.property('childNames');
    expect(component.childNames).to.deep.equal([ 'in:value', 'out:value' ]);
  });

  it("should find input pin of instance", async () => {
    const pin = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'component-B-1' as ElementName,
      'in:value' as ElementName,
    ]);
    expect(pin).to.be.instanceof(Object);
    expect(pin).to.have.property('elementName', 'in:value');

    expect(pin).to.have.property('parentPath')
    expect(pin.parentPath).to.deep.equal([ '#', 'runtime', 'component-B-1']);
    expect(pin).to.have.property('elementType')
    expect(pin.elementType).to.deep.equal([ '#', 'types', 'pins', 'input-pin' ]);

    expect(pin).to.have.property('revision', 1);
    expect(pin).to.have.property('isContainer', false);
    expect(pin).to.have.property('childNames');
    expect(pin.childNames).to.deep.equal(null);

    expect(pin).to.have.property('data');
    expect(pin.data).to.instanceOf(Object);
    expect(pin.data).to.have.property('value', 123);
  });

  it("should find output pin of instance", async () => {
    const pin = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'component-B-1' as ElementName,
      'out:value' as ElementName,
    ]);
    expect(pin).to.be.instanceof(Object);
    expect(pin).to.have.property('elementName', 'out:value');

    expect(pin).to.have.property('parentPath')
    expect(pin.parentPath).to.deep.equal([ '#', 'runtime', 'component-B-1']);
    expect(pin).to.have.property('elementType')
    expect(pin.elementType).to.deep.equal([ '#', 'types', 'pins', 'output-pin' ]);

    expect(pin).to.have.property('revision', 1);
    expect(pin).to.have.property('isContainer', false);
    expect(pin).to.have.property('childNames');
    expect(pin.childNames).to.deep.equal(null);

    expect(pin).to.have.property('data');
    expect(pin.data).to.instanceOf(Object);
    expect(pin.data).to.have.property('value', 456);
  });


});
