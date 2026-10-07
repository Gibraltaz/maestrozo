/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MtzEngine, ElementName, ElementPath } from "@/Engine";
import { BuildDataFunction, BuildElementFunction, BuildHelpers } from "@/typeHandlers/TypeHandler";
import { ElementData, MtzElement } from "@/Element";
import { MemoryStore } from "@/store/MemoryStore";
import { BuildComponentCallback, connectComponents, EvaluateComponentCallback, EvaluateComponentFunction, EvaluateComponentHelpers, EvaluationResult } from "@/typeHandlers/componentTypeHandler";
import { BuildElementDataCallback } from "@/typeHandlers/elementTypeHandler";
import { MtzMessageTime } from "@/MessageQueue";
import { connectComponentToOutput, connectInputToComponent } from "@/typeHandlers/compositeComponentTypeHandler";

let customTime = 10000 as MtzMessageTime; 
const customTimeFunction = () => {
  customTime++;
  return customTime;
}

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
    'out' as ElementName,
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
    'in' as ElementName,
    [ '#' as ElementName, 'types' as ElementName, 'pins' as ElementName, 'input-pin' as ElementName ],
    { value: null}
  );

  await helpers.createChildElement(
    'out' as ElementName,
    [ '#' as ElementName, 'types' as ElementName, 'pins' as ElementName, 'output-pin' as ElementName ],
    { value: null}
  );

}

const relayCustomComponentEvaluateFunction: EvaluateComponentFunction = async (
  element: MtzElement,
  data:Record<string, any>,
  _helpers: EvaluateComponentHelpers 
) : Promise<EvaluationResult> => {

  const pinName = data.pin;
  if (pinName !== 'in')
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
        pin: 'out' as ElementName,
        value: newValue
      }
    ]
  };
  return result;
};


// sink component with only one input pin
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
    'in' as ElementName,
    [ '#' as ElementName, 'types' as ElementName, 'pins' as ElementName, 'input-pin' as ElementName ],
    { value: null}
  );

}

const sinkCustomComponentEvaluateFunction: EvaluateComponentFunction = async (
  element: MtzElement,
  data:Record<string, any>,
  _helpers: EvaluateComponentHelpers
) : Promise<EvaluationResult> => {

  const pinName = data.pin;
  if (pinName !== 'in')
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
             ┌────────┐
             │   C1   │
    ┌────┐ e1│ ┌────┐ │o1 ┌────┐
    │ I1 ├──▢┼─┤ R1 ├─┼▢──┤ O1 │ 
    └────┘   │ └────┘ │   └────┘
             └────────┘

   • C1: composite component
         • e1: composite component input pin
         • o1: composite component output pin
   • R1: internal relay
   • I1: input component connected to the composite component's input pin
   • O1: output component connected to the composite component's output pin
*/

describe("Composite component", () => {
  const engine = new MtzEngine();

  it("should initialize engine", async () => {
    await engine.initialize(new MemoryStore());
    expect(engine).to.have.property('initialized', true)
  });

  it("should set engine time function", async () => {
    engine.setTimeFunction(customTimeFunction);
  });


  it("should declare the relay custom component type", async () => {
    await engine.declareType({
      elementName: 'relay-custom-component' as ElementName,
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
        { name: BuildElementDataCallback, function: relayCustomComponentBuildDataFunction },
        { name: BuildComponentCallback, function: relayCustomComponentBuildElementFunction },
        { name: EvaluateComponentCallback, function: relayCustomComponentEvaluateFunction }
      ]
    });
  });


  it("should instanciate the composite component", async () => {
    const component = await engine.createElement(
      'C1' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'component', 'composite' ] as ElementPath,
      { }
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'C1');
  });

  it("should create a relay component inside composite component", async () => {
    const component = await engine.createElement(
      'R1' as ElementName,
      [ '#', 'runtime', 'C1' ] as ElementPath,
      [ '#', 'types', 'component', 'relay-custom-component' ] as ElementPath,
      { }
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'R1');
  });

  it("should find the relay component as a child of the composite component", async () => {
    const C1 = await engine.getElement(['#', 'runtime', 'C1'] as ElementPath);
    expect(C1).not.to.equal(null);
    expect(C1).to.be.instanceOf(Object);
    expect(C1).to.have.property('revision', 1);

    expect(C1).to.have.property('childNames');
    expect(C1.childNames).to.be.instanceOf(Array);
    expect(C1.childNames).to.deep.equal(['R1']);

    expect(C1).to.have.property('parentPath');
    expect(C1.parentPath).to.be.instanceOf(Array);
    expect(C1.parentPath).to.deep.equal(['#', 'runtime']);

    expect(C1).to.have.property('elementType');
    expect(C1.elementType).to.be.instanceOf(Array);
    expect(C1.elementType).to.deep.equal([ '#', 'types', 'component', 'composite' ]);

    expect(C1).to.have.property('elementName', 'C1');
    expect(C1).to.have.property('isVolatile', false);
    expect(C1).to.have.property('isContainer', true);
  });


  it("should find the relay component", async () => {
    const R1 = await engine.getElement(['#', 'runtime', 'C1', 'R1'] as ElementPath);
    expect(R1).not.to.equal(null);
    expect(R1).to.be.instanceOf(Object);
    expect(R1).to.have.property('revision', 1);

    expect(R1).to.have.property('elementName', 'R1');

    expect(R1).to.have.property('parentPath');
    expect(R1.parentPath).to.be.instanceOf(Array);
    expect(R1.parentPath).to.deep.equal(['#', 'runtime', 'C1']);
  });


  describe("Composite content creation", () => {

    describe("Input pin", () => {
      it("should create an input pin in the composite component", async () => {
        const element = await engine.createElement(
          'e1' as ElementName,
          [ '#', 'runtime', 'C1' ] as ElementPath,
          [ '#', 'types', 'pins', 'input-pin' ] as ElementPath,
          { value: null }
        );
        expect(element).to.be.instanceof(Object);
        expect(element).to.have.property('elementName', 'e1');
      });

      it("should find the input pin in the composite component", async () => {
        const C1 = await engine.getElement(['#', 'runtime', 'C1'] as ElementPath);
        expect(C1).not.to.equal(null);
        expect(C1).to.be.instanceOf(Object);
        expect(C1).to.have.property('revision', 1);

        expect(C1).to.have.property('childNames');
        expect(C1.childNames).to.be.instanceOf(Array);
        expect(C1.childNames).to.deep.equal(['R1', 'e1']);

      });

      it("should find the input pin", async () => {
        const e1 = await engine.getElement(['#', 'runtime', 'C1', 'e1'] as ElementPath);
        expect(e1).not.to.equal(null);
        expect(e1).to.be.instanceOf(Object);
        expect(e1).to.have.property('revision', 1);

        expect(e1).to.have.property('elementName', 'e1');

        expect(e1).to.have.property('parentPath');
        expect(e1.parentPath).to.be.instanceOf(Array);
        expect(e1.parentPath).to.deep.equal(['#', 'runtime', 'C1']);

        expect(e1).to.have.property('elementType');
        expect(e1.elementType).to.be.instanceOf(Array);
        expect(e1.elementType).to.deep.equal([ '#', 'types', 'pins', 'input-pin' ]);
      });
    });


    describe("Output pin", () => {
      it("should create an output pin in the composite component", async () => {
        const element = await engine.createElement(
          'o1' as ElementName,
          [ '#', 'runtime', 'C1' ] as ElementPath,
          [ '#', 'types', 'pins', 'output-pin' ] as ElementPath,
          { value:null }
        );
        expect(element).to.be.instanceof(Object);
        expect(element).to.have.property('elementName', 'o1');
        /*
         output pin {
            revision: 1,
            elementName: 'o1',
            parentPath: [ '#', 'runtime', 'C1' ],
            elementType: [ '#', 'types', 'pins', 'output-pin' ],
            isContainer: false,
            isVolatile: false,
            childNames: null,
            data: { value: null }
          }
         */
      });

      it("should find the output pin in the composite component", async () => {
        const C1 = await engine.getElement(['#', 'runtime', 'C1'] as ElementPath);
        expect(C1).not.to.equal(null);
        expect(C1).to.be.instanceOf(Object);
        expect(C1).to.have.property('revision', 1);

        expect(C1).to.have.property('childNames');
        expect(C1.childNames).to.be.instanceOf(Array);
        expect(C1.childNames).to.deep.equal(['R1', 'e1', 'o1']);

      });

      it("should find the output pin", async () => {
        const o1 = await engine.getElement(['#', 'runtime', 'C1', 'o1'] as ElementPath);
        expect(o1).not.to.equal(null);
        expect(o1).to.be.instanceOf(Object);
        expect(o1).to.have.property('revision', 1);

        expect(o1).to.have.property('elementName', 'o1');

        expect(o1).to.have.property('parentPath');
        expect(o1.parentPath).to.be.instanceOf(Array);
        expect(o1.parentPath).to.deep.equal(['#', 'runtime', 'C1']);

        expect(o1).to.have.property('elementType');
        expect(o1.elementType).to.be.instanceOf(Array);
        expect(o1.elementType).to.deep.equal([ '#', 'types', 'pins', 'output-pin' ]);
      });
    });


    describe("Connection composite input to internal relay input", () => {

      it("should connect input pin and relay in the composite component", async () => {
        /* TODO ménage
        const connection = await engine.createElement(
          'e1->R1' as ElementName,
          [ '#', 'runtime', 'C1' ] as ElementPath,
          [ '#', 'types', 'links', 'connection' ] as ElementPath,
          {
            sourceComponent: 'e1', // C1 
            sourcePin: 'out',      // e1
            targetComponent: 'R1',
            targetPin: 'in'
          }
        );
        */

        const connection = await connectInputToComponent(
          engine,
          [ '#', 'runtime', 'C1' ] as ElementPath,
          'e1' as ElementName,
          'R1' as ElementName,
          'in' as ElementName
        );

        expect(connection).to.be.instanceof(Object);
        expect(connection).to.have.property('revision', 1);
        expect(connection).to.have.property('elementName', 'e1|R1|in');

        expect(connection).to.have.property('parentPath');
        expect(connection.parentPath).to.deep.equal([ '#', 'runtime', 'C1' ]);

        expect(connection).to.have.property('elementType');
        expect(connection.elementType).to.deep.equal([ '#', 'types', 'links', 'connection' ]);

        expect(connection).to.have.property('data');
        expect(connection.data).to.have.property('sourceComponent', null);
        expect(connection.data).to.have.property('sourcePin', 'e1');
        expect(connection.data).to.have.property('targetComponent', 'R1');
        expect(connection.data).to.have.property('targetPin', 'in');
      });

      it("should find the connection", async () => {
        const connection = await engine.getElement(['#', 'runtime', 'C1', 'e1|R1|in'] as ElementPath);
        expect(connection).not.to.equal(null);
        expect(connection).to.be.instanceOf(Object);
        expect(connection).to.have.property('revision', 1);
        expect(connection).to.have.property('elementName', 'e1|R1|in');
        expect(connection).to.have.property('parentPath');
        expect(connection.parentPath).to.be.instanceOf(Array);
        expect(connection.parentPath).to.deep.equal(['#', 'runtime', 'C1']);
        expect(connection).to.have.property('elementType');
        expect(connection.elementType).to.be.instanceOf(Array);
        expect(connection.elementType).to.deep.equal([ '#', 'types', 'links', 'connection' ]);
      });

      it("should find the connection in the composite component", async () => {
        const C1 = await engine.getElement(['#', 'runtime', 'C1'] as ElementPath);
        expect(C1).not.to.equal(null);
        expect(C1).to.be.instanceOf(Object);
        expect(C1).to.have.property('revision', 1);

        expect(C1).to.have.property('childNames');
        expect(C1.childNames).to.be.instanceOf(Array);
        expect(C1.childNames).to.deep.equal(['R1', 'e1', 'o1', 'e1|R1|in']);
      });
    });


    describe("Connection internal relay output pin to composite output pin", () => {

      it("should connect the relay and the output pin in the composite component", async () => {
          /* TODO ménage
          const connection = await engine.createElement(
            'R1->o1' as ElementName,
            [ '#', 'runtime', 'C1' ] as ElementPath,
            [ '#', 'types', 'links', 'connection' ] as ElementPath,
            {
              sourceComponent: 'R1',
              sourcePin: 'out',
              targetComponent: 'o1',
              targetPin: 'in'
            }
          );
          */
        const connection = await connectComponentToOutput(
          engine,
          [ '#', 'runtime', 'C1' ] as ElementPath,
          'o1' as ElementName,
          'R1' as ElementName,
          'out' as ElementName
        );

        expect(connection).to.be.instanceof(Object);
        expect(connection).to.have.property('revision', 1);
        expect(connection).to.have.property('elementName', 'R1|out|o1');

        expect(connection).to.have.property('parentPath');
        expect(connection.parentPath).to.deep.equal([ '#', 'runtime', 'C1' ]);

        expect(connection).to.have.property('elementType');
        expect(connection.elementType).to.deep.equal([ '#', 'types', 'links', 'connection' ]);

        expect(connection).to.have.property('data');
        expect(connection.data).to.have.property('sourceComponent', 'R1');
        expect(connection.data).to.have.property('sourcePin', 'out');
        expect(connection.data).to.have.property('targetComponent', null);
        expect(connection.data).to.have.property('targetPin', 'o1');
      });

      it("should find the connection", async () => {
        const connection = await engine.getElement(['#', 'runtime', 'C1', 'R1|out|o1'] as ElementPath);
        expect(connection).not.to.equal(null);
        expect(connection).to.be.instanceOf(Object);
        expect(connection).to.have.property('revision', 1);
        expect(connection).to.have.property('elementName', 'R1|out|o1');
        expect(connection).to.have.property('parentPath');
        expect(connection.parentPath).to.be.instanceOf(Array);
        expect(connection.parentPath).to.deep.equal(['#', 'runtime', 'C1']);
        expect(connection).to.have.property('elementType');
        expect(connection.elementType).to.be.instanceOf(Array);
        expect(connection.elementType).to.deep.equal([ '#', 'types', 'links', 'connection' ]);
      });

      it("should find the connection in the composite component", async () => {
        const C1 = await engine.getElement(['#', 'runtime', 'C1'] as ElementPath);
        expect(C1).not.to.equal(null);
        expect(C1).to.be.instanceOf(Object);
        expect(C1).to.have.property('revision', 1);

        expect(C1).to.have.property('childNames');
        expect(C1.childNames).to.be.instanceOf(Array);
        expect(C1.childNames).to.deep.equal(['R1', 'e1', 'o1', 'e1|R1|in', 'R1|out|o1']);
      });

    });
  });


  describe("Source component", () => {

    it("should declare the source custom component type", async () => {
      await engine.declareType({
        elementName: 'source-custom-component' as ElementName,
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
          { name: BuildElementDataCallback, function: sourceCustomComponentBuildDataFunction },
          { name: BuildComponentCallback, function: sourceCustomComponentBuildElementFunction }
        ]
      });
    });


    it("should instanciate the source component", async () => {
      const component = await engine.createElement(
        'I1' as ElementName,
        [ '#', 'runtime' ] as ElementPath,
        [ '#', 'types', 'component', 'source-custom-component' ] as ElementPath,
        { value: 123 }
      );
      expect(component).to.be.instanceof(Object);
      expect(component).to.have.property('elementName', 'I1');
    });

    it("should connect input pin and relay in the composite component", async () => {
      const connection = await connectComponents(
        engine,
        [ '#', 'runtime' ] as ElementPath,
        'I1' as ElementName,
        'out' as ElementName,
        'C1' as ElementName,
        'e1' as ElementName
      );

      expect(connection).to.be.instanceof(Object);
      expect(connection).to.have.property('revision', 1);
      expect(connection).to.have.property('elementName', 'I1|out|C1|e1');

      expect(connection).to.have.property('parentPath');
      expect(connection.parentPath).to.deep.equal([ '#', 'runtime' ]);

      expect(connection).to.have.property('elementType');
      expect(connection.elementType).to.deep.equal([ '#', 'types', 'links', 'connection' ]);

      expect(connection).to.have.property('data');
      expect(connection.data).to.have.property('sourceComponent', 'I1');
      expect(connection.data).to.have.property('sourcePin', 'out');
      expect(connection.data).to.have.property('targetComponent', 'C1');
      expect(connection.data).to.have.property('targetPin', 'e1');
    });


  });


  describe("Sink component", () => {

    it("should declare the sink custom component type", async () => {
      await engine.declareType({
        elementName: 'sink-custom-component' as ElementName,
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
          { name: BuildElementDataCallback, function: sinkCustomComponentBuildDataFunction },
          { name: BuildComponentCallback, function: sinkCustomComponentBuildElementFunction },
          { name: EvaluateComponentCallback, function: sinkCustomComponentEvaluateFunction }
        ]
      });
    });

    it("should instanciate the sink component", async () => {
      const component = await engine.createElement(
        'O1' as ElementName,
        [ '#', 'runtime' ] as ElementPath,
        [ '#', 'types', 'component', 'sink-custom-component' ] as ElementPath,
        { }
      );
      expect(component).to.be.instanceof(Object);
      expect(component).to.have.property('elementName', 'O1');
    });

    it("should connect composite and sink components", async () => {
      const connection = await connectComponents(
        engine,
        [ '#', 'runtime' ] as ElementPath,
        'C1' as ElementName,
        'o1' as ElementName,
        'O1' as ElementName,
        'in' as ElementName
      );

      expect(connection).to.be.instanceof(Object);
      expect(connection).to.have.property('revision', 1);
      expect(connection).to.have.property('elementName', 'C1|o1|O1|in');
      expect(connection).to.have.property('parentPath');
      expect(connection.parentPath).to.deep.equal([ '#', 'runtime' ]);
      expect(connection).to.have.property('elementType');
      expect(connection.elementType).to.deep.equal([ '#', 'types', 'links', 'connection' ]);
      expect(connection).to.have.property('isContainer', false);
      expect(connection).to.have.property('isVolatile', false);
      expect(connection).to.have.property('childNames', null);

      expect(connection).to.have.property('data');
      expect(connection.data).to.have.property('sourceComponent', 'C1');
      expect(connection.data).to.have.property('sourcePin', 'o1');
      expect(connection.data).to.have.property('targetComponent', 'O1');
      expect(connection.data).to.have.property('targetPin', 'in');
    });

  });


  describe("Runtime first pass", () => {

    it("should have no value in composite input pin", async () => {
      const inputPin = await engine.getElement([ '#', 'runtime', 'C1', 'e1' ] as ElementPath);
      expect(inputPin).to.be.instanceOf(Object);
      expect(inputPin).to.have.property('elementName', 'e1');
      expect(inputPin).to.have.property('data');
      expect(inputPin.data).to.have.property('value', null);
      expect(inputPin).to.have.property('revision', 1);
    });

    it("should have no value in composite output pin", async () => {
      const inputPin = await engine.getElement([ '#', 'runtime', 'C1', 'o1' ] as ElementPath);
      expect(inputPin).to.be.instanceOf(Object);
      expect(inputPin).to.have.property('elementName', 'o1');
      expect(inputPin).to.have.property('data');
      expect(inputPin.data).to.have.property('value', null);
      expect(inputPin).to.have.property('revision', 1);
    });


    it("should find a first message in message queue", async () => {
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
      expect(message).to.be.have.property('at', 10001);
      expect(message).to.be.have.property('messageType', 'changed');
      expect(message).to.be.have.property('elementPath');
      expect(message.elementPath).to.deep.equal([ '#', 'runtime', 'C1' ]);
      expect(message).to.be.have.property('data');
      expect(message.data).to.be.instanceOf(Object);
      expect(message.data).to.have.property('pin', 'e1');
      expect(message.data).to.have.property('value', 123);
    });

    it("should process the first message", async () => {
      await engine.runOnce();
    });

    it("should have updated the composite input pin", async () => {
      const inputPin = await engine.getElement([ '#', 'runtime', 'C1', 'e1' ] as ElementPath);
      expect(inputPin).to.be.instanceOf(Object);
      expect(inputPin).to.have.property('elementName', 'e1');
      expect(inputPin).to.have.property('data');
      expect(inputPin.data).to.have.property('value', 123);
      expect(inputPin).to.have.property('revision', 2);
    });

    it("should find a second message in message queue", async () => {
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
      expect(message).to.be.have.property('at', 10003);
      expect(message).to.be.have.property('messageType', 'changed');
      expect(message).to.be.have.property('elementPath');
      expect(message.elementPath).to.deep.equal([ '#', 'runtime', 'C1', 'R1' ]);
      expect(message).to.be.have.property('data');
      expect(message.data).to.be.instanceOf(Object);
      expect(message.data).to.have.property('pin', 'in');
      expect(message.data).to.have.property('value', 123);
    });


    it("should process the second message", async () => {
      await engine.runOnce();
    });


    it("should have updated the relay internal value ", async () => {
      const component = await engine.getElement([ '#', 'runtime', 'C1', 'R1' ] as ElementPath);
      expect(component).to.be.instanceOf(Object);
      expect(component).to.have.property('revision', 2);
      expect(component).to.have.property('data');
      expect(component.data).to.have.property('internalValue', 123);
    });

    it("should find a third message in message queue", async () => {
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
      expect(message).to.be.have.property('at', 10005);
      expect(message).to.be.have.property('messageType', 'changed');
      expect(message).to.be.have.property('elementPath');
      expect(message.elementPath).to.deep.equal([ '#', 'runtime', 'C1' ]);
      expect(message).to.be.have.property('data');
      expect(message.data).to.be.instanceOf(Object);
      expect(message.data).to.have.property('pin', 'o1');
      expect(message.data).to.have.property('value', 123);
    });


    it("should process the third message", async () => {
      await engine.runOnce();
    });

    it("should have updated the composite output pin", async () => {
      const inputPin = await engine.getElement([ '#', 'runtime', 'C1', 'o1' ] as ElementPath);
      expect(inputPin).to.be.instanceOf(Object);
      expect(inputPin).to.have.property('elementName', 'o1');
      expect(inputPin).to.have.property('data');
      expect(inputPin.data).to.have.property('value', 123);
      expect(inputPin).to.have.property('revision', 2);
    });

    it("should find a fourth message in message queue", async () => {
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
      expect(message).to.be.have.property('at', 10007);
      expect(message).to.be.have.property('messageType', 'changed');
      expect(message).to.be.have.property('elementPath');
      expect(message.elementPath).to.deep.equal([ '#', 'runtime', 'O1' ]);
      expect(message).to.be.have.property('data');
      expect(message.data).to.be.instanceOf(Object);
      expect(message.data).to.have.property('pin', 'in');
      expect(message.data).to.have.property('value', 123);
    });

    it("should process the fourth message", async () => {
      await engine.runOnce();
    });

    it("should have updated the shink", async () => {
      const sink = await engine.getElement([ '#', 'runtime', 'O1' ] as ElementPath);
      expect(sink).to.be.instanceOf(Object);
      expect(sink).to.have.property('elementName', 'O1');
      expect(sink).to.have.property('data');
      expect(sink.data).to.have.property('internalValue', 123);
      expect(sink).to.have.property('revision', 2);
    });

    it("should have no waiting messages", async () => {
      const messageQueueElement = await engine.getElement(['#', 'system', 'message-queue'] as ElementPath);
      expect(messageQueueElement).to.be.instanceof(Object);
      expect(messageQueueElement).to.have.property('data')
      expect(messageQueueElement.data).to.have.property('messages')
      const messages = messageQueueElement?.data?.messages ?? null;
      assert(messages !== null);
      expect(messages).to.be.instanceOf(Array);
      expect(messages.length).to.equal(0);
    });

  });

  //describe("Runtime first pass", () => {
  //  //TODO mettre à jour la valeur de I1 et suivre la propagation du message
  //});

});

/* TODO tester un composant avec deux sous-composants
            ┌────────────────┐
            │       C1       │
   ┌────┐ e1│ ┌────┐  ┌────┐ │o1 ┌────┐
   │ I1 ├──▢┼─┤ R1 ├──┤ R2 ├─┼▢──┤ O1 │ 
   └────┘   │ └────┘  └────┘ │   └────┘
            │                │
            └────────────────┘
*/
