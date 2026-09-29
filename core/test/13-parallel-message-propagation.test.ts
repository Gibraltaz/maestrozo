/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MtzEngine, ElementName, ElementPath } from "@/Engine";
import { BuildDataFunction, BuildElementFunction, BuildHelpers, EvaluateComponentFunction, EvaluationResult } from "@/typeHandlers/TypeHandler";
import { ElementData, MtzElement } from "@/Element";
import { MemoryStore } from "@/store/MemoryStore";
import { MtzMessageTime } from "@/MessageQueue";

let customTime = -1;
const customTimeFunction = () => customTime as MtzMessageTime;

// first component : source component with one output pin
const sourceCustomComponentBuildDataFunction: BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  params:Record<string, any>,
  _helpers: BuildHelpers
): Promise<ElementData> => {
  if (params.value === undefined)
    throw new Error("Param «value» is not defined");
  return {
    internalValue: params.value,
  } as ElementData;
};

const sourceCustomComponentBuildElementFunction: BuildElementFunction = async (
  element: MtzElement,
  _params:Record<string, any>,
  helpers: BuildHelpers
): Promise<void> => {

  const internalValue = element?.data?.internalValue ?? null;
  if (internalValue === null)
    throw new Error("Internal value should not be null");

  await helpers.createChildElement(
    'out:value' as ElementName,
    [ '#' as ElementName, 'types' as ElementName, 'pins' as ElementName, 'output-pin' as ElementName ],
    { value: internalValue }
  );
}

// second component : relay component with one input pin and one output pin
const relayCustomComponentBuildDataFunction: BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildHelpers
): Promise<ElementData> => {
  return {
    internalValue: null
  } as ElementData;
};

const relayCustomComponentBuildElementFunction: BuildElementFunction = async (
  _element: MtzElement,
  _params:Record<string, any>,
  helpers: BuildHelpers
): Promise<void> => {

  await helpers.createChildElement(
    'in:value' as ElementName,
    [ '#' as ElementName, 'types' as ElementName, 'pins' as ElementName, 'input-pin' as ElementName ],
    { value: null}
  );

  await helpers.createChildElement(
    'out:value' as ElementName,
    [ '#' as ElementName, 'types' as ElementName, 'pins' as ElementName, 'output-pin' as ElementName ],
    { value: null}
  );

}

const relayCustomComponentEvaluateFunction: EvaluateComponentFunction = async (
  element: MtzElement,
  data:Record<string, any>,
  _helpers: BuildHelpers
) : Promise<EvaluationResult> => {

  const pinName = data.pin;
  if (pinName !== 'in:value')
    throw new Error("Invalid pin name in evaluation data");

  const newValue = data.value;
  if (newValue === undefined)
    throw new Error("Invalid value in evaluation data");

  const result: EvaluationResult = {
    setData: {
      ...element.data,
      internalValue: newValue
    },
    setOutputs: [
      {
        pin: 'out:value' as ElementName,
        value: newValue
      }
    ]
  };
  return result;
};



// third sink component with only one input pin
const sinkCustomComponentBuildDataFunction: BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildHelpers
): Promise<ElementData> => {
  return {
    internalValue: null
  } as ElementData;
};

const sinkCustomComponentBuildElementFunction: BuildElementFunction = async (
  _element: MtzElement,
  _params:Record<string, any>,
  helpers: BuildHelpers
): Promise<void> => {

  await helpers.createChildElement(
    'in:value' as ElementName,
    [ '#' as ElementName, 'types' as ElementName, 'pins' as ElementName, 'input-pin' as ElementName ],
    { value: null}
  );

}

const sinkCustomComponentEvaluateFunction: EvaluateComponentFunction = async (
  element: MtzElement,
  data:Record<string, any>,
  _helpers: BuildHelpers
) : Promise<EvaluationResult> => {

  const pinName = data.pin;
  if (pinName !== 'in:value')
    throw new Error("Invalid pin name in evaluation data");

  const newValue = data.value;
  if (newValue === undefined)
    throw new Error("Invalid value in evaluation data");

  const newData = {...element.data, internalValue: newValue};

  const result: EvaluationResult = {
    setData: newData,
    setOutputs: null
  };
  return result;
};

/*
            ┌─────┐
┌─────┐  ┌──│     │
│     │──┘  └─────┘
│     │──┐  ┌─────┐
└─────┘  └──│     │
            └─────┘
*/
describe("Parallel pin connection with three components", () => {
  const engine = new MtzEngine();

  it("should initialize engine", async () => {
    await engine.initialize(new MemoryStore());
    expect(engine).to.have.property('initialized', true)
  });

  it("should declare the source custom component type", async () => {
    await engine.declareType({
      elementName: 'source-custom-component' as ElementName,
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
      buildDataFunction: sourceCustomComponentBuildDataFunction,
      buildElementFunction: sourceCustomComponentBuildElementFunction,
      evaluateComponentFunction: null
    });
  });


  it("should declare the sink custom component type", async () => {
    await engine.declareType({
      elementName: 'sink-custom-component' as ElementName,
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
      buildDataFunction: sinkCustomComponentBuildDataFunction,
      buildElementFunction: sinkCustomComponentBuildElementFunction,
      evaluateComponentFunction: sinkCustomComponentEvaluateFunction
    });
  });


  it("should instanciate the source component", async () => {
    const component = await engine.createElement(
      'source-component-1' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'components', 'source-custom-component' ] as ElementPath,
      {
        value: 123
      }
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'source-component-1');
  });


  it("should instanciate the first sink component", async () => {
    const component = await engine.createElement(
      'sink-component-1' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'components', 'sink-custom-component' ] as ElementPath,
      { }
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'sink-component-1');
  });

  it("should instanciate the second sink component", async () => {
    const component = await engine.createElement(
      'sink-component-2' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'components', 'sink-custom-component' ] as ElementPath,
      { }
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'sink-component-2');
  });


  it("should set engine time function", async () => {
    customTime = 123456;
    engine.setTimeFunction(customTimeFunction);
  });

  it("should connect source and first sink components", async () => {
    const connection = await engine.createConnection(
      [ '#', 'runtime' ] as ElementPath,
      'source-component-1' as ElementName,
      'out:value' as ElementName,
      'sink-component-1' as ElementName,
      'in:value' as ElementName
    );

    expect(connection).to.be.instanceof(Object);
    expect(connection).to.have.property('revision', 1);
    expect(connection).to.have.property('elementName', 'source-component-1|out:value|sink-component-1|in:value');
    expect(connection).to.have.property('parentPath');
    expect(connection.parentPath).to.deep.equal([ '#', 'runtime' ]);
    expect(connection).to.have.property('elementType');
    expect(connection.elementType).to.deep.equal([ '#', 'types', 'links', 'connection' ]);
    expect(connection).to.have.property('isContainer', false);
    expect(connection).to.have.property('isVolatile', false);
    expect(connection).to.have.property('childNames', null);

    expect(connection).to.have.property('data');
    expect(connection.data).to.have.property('sourceComponent', 'source-component-1');
    expect(connection.data).to.have.property('sourcePin', 'out:value');
    expect(connection.data).to.have.property('targetComponent', 'sink-component-1');
    expect(connection.data).to.have.property('targetPin', 'in:value');
  });

  it("should find a message to update first sink", async () => {
    const messageQueueElement = await engine.getElement(['#', 'system', 'message-queue'] as ElementPath);
    expect(messageQueueElement).to.be.instanceof(Object);
    expect(messageQueueElement).to.have.property('data')
    expect(messageQueueElement.data).to.have.property('messages')
    const messages = messageQueueElement?.data?.messages ?? null;
    assert(messages !== null);
    expect(messages).to.be.instanceOf(Array);
    expect(messages.length).to.equal(1);
    const message = messages[0];
    expect(message).to.be.instanceOf(Object);
    expect(message).to.be.have.property('at', 123456);
    expect(message).to.be.have.property('messageType', 'changed');
    expect(message).to.be.have.property('elementPath');
    expect(message.elementPath).to.deep.equal([ '#', 'runtime', 'sink-component-1' ]);
    expect(message).to.be.have.property('data');
    expect(message.data).to.be.instanceOf(Object);
    expect(message.data).to.have.property('pin', 'in:value');
    expect(message.data).to.have.property('value', 123);
  });

  it("should update engine time", async () => {
    customTime = 123457;
  });

  it("should connect source and second sink components", async () => {
    const connection = await engine.createConnection(
      [ '#', 'runtime' ] as ElementPath,
      'source-component-1' as ElementName,
      'out:value' as ElementName,
      'sink-component-2' as ElementName,
      'in:value' as ElementName
    );

    expect(connection).to.be.instanceof(Object);
    expect(connection).to.have.property('revision', 1);
    expect(connection).to.have.property('elementName', 'source-component-1|out:value|sink-component-2|in:value');
    expect(connection).to.have.property('parentPath');
    expect(connection.parentPath).to.deep.equal([ '#', 'runtime' ]);
    expect(connection).to.have.property('elementType');
    expect(connection.elementType).to.deep.equal([ '#', 'types', 'links', 'connection' ]);
    expect(connection).to.have.property('isContainer', false);
    expect(connection).to.have.property('isVolatile', false);
    expect(connection).to.have.property('childNames', null);

    expect(connection).to.have.property('data');
    expect(connection.data).to.have.property('sourceComponent', 'source-component-1');
    expect(connection.data).to.have.property('sourcePin', 'out:value');
    expect(connection.data).to.have.property('targetComponent', 'sink-component-2');
    expect(connection.data).to.have.property('targetPin', 'in:value');
  });

  it("should find a message to update second sink", async () => {
    const messageQueueElement = await engine.getElement(['#', 'system', 'message-queue'] as ElementPath);
    expect(messageQueueElement).to.be.instanceof(Object);
    expect(messageQueueElement).to.have.property('data')
    expect(messageQueueElement.data).to.have.property('messages')
    const messages = messageQueueElement?.data?.messages ?? null;
    assert(messages !== null);
    expect(messages).to.be.instanceOf(Array);
    expect(messages.length).to.equal(2);

    let message = messages[0];
    expect(message).to.be.instanceOf(Object);
    expect(message).to.be.have.property('at', 123456);
    expect(message).to.be.have.property('messageType', 'changed');
    expect(message).to.be.have.property('elementPath');
    expect(message.elementPath).to.deep.equal([ '#', 'runtime', 'sink-component-1' ]);
    expect(message).to.be.have.property('data');
    expect(message.data).to.be.instanceOf(Object);
    expect(message.data).to.have.property('pin', 'in:value');
    expect(message.data).to.have.property('value', 123);

    message = messages[1];
    expect(message).to.be.instanceOf(Object);
    expect(message).to.be.have.property('at', 123457);
    expect(message).to.be.have.property('messageType', 'changed');
    expect(message).to.be.have.property('elementPath');
    expect(message.elementPath).to.deep.equal([ '#', 'runtime', 'sink-component-2' ]);
    expect(message).to.be.have.property('data');
    expect(message.data).to.be.instanceOf(Object);
    expect(message.data).to.have.property('pin', 'in:value');
    expect(message.data).to.have.property('value', 123);
  });


  it("should process the first waiting message", async () => {
    await engine.runOnce();
  });

  it("should find one message in message queue to update second sink", async () => {
    const messageQueueElement = await engine.getElement(['#', 'system', 'message-queue'] as ElementPath);
    expect(messageQueueElement).to.be.instanceof(Object);
    expect(messageQueueElement).to.have.property('data')
    expect(messageQueueElement.data).to.have.property('messages')
    const messages = messageQueueElement?.data?.messages ?? null;
    assert(messages !== null);
    expect(messages).to.be.instanceOf(Array);
    expect(messages.length).to.equal(1);

    const message = messages[0];
    expect(message).to.be.instanceOf(Object);
    expect(message).to.be.have.property('at', 123457);
    expect(message).to.be.have.property('messageType', 'changed');
    expect(message).to.be.have.property('elementPath');
    expect(message.elementPath).to.deep.equal([ '#', 'runtime', 'sink-component-2' ]);
    expect(message).to.be.have.property('data');
    expect(message.data).to.be.instanceOf(Object);
    expect(message.data).to.have.property('pin', 'in:value');
    expect(message.data).to.have.property('value', 123);
  });

  it("should control first sink component internal value", async () => {
    const relayComponent = await engine.getElement(['#', 'runtime', 'sink-component-1'] as ElementPath);
    expect(relayComponent).not.to.equal(null);
    expect(relayComponent).to.be.instanceOf(Object);
    expect(relayComponent).to.have.property('revision', 2);
    expect(relayComponent).to.have.property('data');
    const componentData = relayComponent.data;
    expect(componentData).to.be.instanceOf(Object);
    expect(componentData).to.have.property('internalValue', 123);
  });

  it("should process the second waiting message", async () => {
    await engine.runOnce();
  });

  it("should find no message in message queue", async () => {
    const messageQueueElement = await engine.getElement(['#', 'system', 'message-queue'] as ElementPath);
    expect(messageQueueElement).to.be.instanceof(Object);
    expect(messageQueueElement).to.have.property('data')
    expect(messageQueueElement.data).to.have.property('messages')
    const messages = messageQueueElement?.data?.messages ?? null;
    assert(messages !== null);
    expect(messages).to.be.instanceOf(Array);
    expect(messages.length).to.equal(0);
  });

  it("should control second sink component internal value", async () => {
    const relayComponent = await engine.getElement(['#', 'runtime', 'sink-component-2'] as ElementPath);
    expect(relayComponent).not.to.equal(null);
    expect(relayComponent).to.be.instanceOf(Object);
    expect(relayComponent).to.have.property('revision', 2);
    expect(relayComponent).to.have.property('data');
    const componentData = relayComponent.data;
    expect(componentData).to.be.instanceOf(Object);
    expect(componentData).to.have.property('internalValue', 123);
  });

});


