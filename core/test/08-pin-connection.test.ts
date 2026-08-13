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
  params:Record<string, any>,
  _helpers: BuildHelpers
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

const customComponentBuildElementFunction: BuildElementFunction = async (
  element: MtzElement,
  _params:Record<string, any>,
  helpers: BuildHelpers
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



describe("Pin connection", () => {
  const engine = new MtzEngine();

  it("should initialize engine", async () => {
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
      isContainer: true,
      isVolatile: false,
      buildDataFunction: customComponentBuildDataFunction,
      buildElementFunction: customComponentBuildElementFunction
    });

  });

  it("should create a first instance of custom component", async () => {
    const component = await engine.createElement(
      'component-1' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'components', 'custom-component' ] as ElementPath,
      {
        inValue: 123,
        outValue: 456
      }
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'component-1');

  });

  it("should create a second instance of custom component", async () => {
    const component = await engine.createElement(
      'component-2' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'components', 'custom-component' ] as ElementPath,
      {
        inValue: 123,
        outValue: 456
      }
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'component-2');
  });


  it("should create a connection with createElement", async () => {
    const connection = await engine.createElement(
      'connection-1' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'links', 'connection' ] as ElementPath,
      {
        sourceComponent: 'component-1',
        sourcePin: 'out:value',
        targetComponent: 'component-2',
        targetPin: 'in:value'
      }
    );
    expect(connection).to.be.instanceof(Object);
    expect(connection).to.have.property('revision', 1);
    expect(connection).to.have.property('elementName', 'connection-1');
    expect(connection).to.have.property('parentPath');
    expect(connection.parentPath).to.deep.equal([ '#', 'runtime' ]);
    expect(connection).to.have.property('elementType');
    expect(connection.elementType).to.deep.equal([ '#', 'types', 'links', 'connection' ]);
    expect(connection).to.have.property('isContainer', false);
    expect(connection).to.have.property('isVolatile', false);
    expect(connection).to.have.property('childNames', null);

    expect(connection).to.have.property('data');
    expect(connection.data).to.have.property('sourceComponent', 'component-1');
    expect(connection.data).to.have.property('sourcePin', 'out:value');
    expect(connection.data).to.have.property('targetComponent', 'component-2');
    expect(connection.data).to.have.property('targetPin', 'in:value');
  });

  it("should create a connection with createConnection", async () => {
    const connection = await engine.createConnection(
      [ '#', 'runtime' ] as ElementPath,
      'component-1' as ElementName,
      'out:value' as ElementName,
      'component-2' as ElementName,
      'in:value' as ElementName
    );
    expect(connection).to.be.instanceof(Object);
    expect(connection).to.have.property('revision', 1);
    expect(connection).to.have.property('elementName', 'component-1|out:value|component-2|in:value');
    expect(connection).to.have.property('parentPath');
    expect(connection.parentPath).to.deep.equal([ '#', 'runtime' ]);
    expect(connection).to.have.property('elementType');
    expect(connection.elementType).to.deep.equal([ '#', 'types', 'links', 'connection' ]);
    expect(connection).to.have.property('isContainer', false);
    expect(connection).to.have.property('isVolatile', false);
    expect(connection).to.have.property('childNames', null);

    expect(connection).to.have.property('data');
    expect(connection.data).to.have.property('sourceComponent', 'component-1');
    expect(connection.data).to.have.property('sourcePin', 'out:value');
    expect(connection.data).to.have.property('targetComponent', 'component-2');
    expect(connection.data).to.have.property('targetPin', 'in:value');
  });


});
