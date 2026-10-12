/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MtzEngine, ElementName, ElementPath } from "../src/Engine";
import { ElementData, MtzElement } from "../src/Element";
import { MemoryStore } from "../src/store/MemoryStore";
import { MtzElementCapabilities } from "../src/elementCapabilities";
import { MtzMessageTime } from "../src/MessageQueue";
import {
  BuildElementDataCallback, BuildElementDataFunction, BuildElementDataHelpers,
  InitializeElementCallback, InitializeElementFunction
} from "../src/typeHandlers/elementTypeHandler";
import {
  EvaluateComponentCallback, EvaluateComponentFunction, 
  EvaluateComponentHelpers, EvaluteComponentResult
} from "../src/typeHandlers/componentTypeHandler";

let containerCapabilities: MtzElementCapabilities|null = null;
let sinkCapabilities: MtzElementCapabilities|null = null;
let customTime = -1;
let evaluationData: any = null;

const customTimeFunction = () => customTime as MtzMessageTime;

// first custom component
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
    containerCapabilities = elementCapabilities;
};

// second custom component
const sinkCustomComponentBuildDataFunction: BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildElementDataHelpers
): Promise<ElementData> => {
  return {
    internalValue: null
  } as ElementData;
};

const sinkCustomComponentInitializeFunction : InitializeElementFunction = async (
  _element: MtzElement,
  elementCapabilities: MtzElementCapabilities
): Promise <void> => {
    sinkCapabilities = elementCapabilities;
};


/*  TODO à supprimer
const sinkCustomComponentBuildElementFunction: BuildComponentFunction = async (
  _element: MtzElement,
  _params:Record<string, any>,
  helpers: BuildComponentHelpers
): Promise<void> => {
}
*/

const sinkCustomComponentEvaluateFunction: EvaluateComponentFunction = async (
  element: MtzElement,
  data:Record<string, any>,
  _helpers: EvaluateComponentHelpers 
) : Promise<EvaluteComponentResult> => {
  evaluationData = data;
  const result: EvaluteComponentResult = {
    setData: { ...element.data },
    setOutputs: []
  };
  return result;
};




describe("Element capabilities", () => {
  const engine = new MtzEngine();

  it("should initialize engine", async () => {
    await engine.initialize(new MemoryStore());
    expect(engine).to.have.property('initialized', true)
  });

  it("should declare the custom container component", async () => {
    await engine.declareType({
      elementName: 'custom-container-A' as ElementName,
      parentPath: [ '#', 'types', 'container' ] as ElementPath,
      elementType: [ '#', 'types', 'type' ] as ElementPath,
      isDerivable: false,
      isContainer: true,
      isVolatile: false,
      callbacks: [
        { name: BuildElementDataCallback,  function: customContainerBuildElementDataFunction },
        { name: InitializeElementCallback, function: customContainerInitializeFunction },
      ]
    });
  });

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
        //{ name: BuildComponentCallback, function: sinkCustomComponentBuildElementFunction },
        { name: InitializeElementCallback, function: sinkCustomComponentInitializeFunction },
        { name: EvaluateComponentCallback, function: sinkCustomComponentEvaluateFunction }
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

  it("should create a sink component in custom container", async () => {
    const component = await engine.createElement(
      'S1' as ElementName,
      [ '#', 'runtime', 'C1' ] as ElementPath,
      [ '#', 'types', 'component', 'sink-custom-component' ] as ElementPath,
      { }
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'S1');
  });

  it("should have found container capabilities", async () => {
    expect(containerCapabilities).to.be.instanceof(Object);
    expect(containerCapabilities).to.have.all.keys(
      'getPath',
      'getChild',
      'getParent',
      'getElement',
      'scheduleEvaluation'
    );
  });

  it("should have found sink capabilities", async () => {
    expect(sinkCapabilities).to.be.instanceof(Object);
    expect(sinkCapabilities).to.have.all.keys(
      'getPath',
      'getChild',
      'getParent',
      'getElement',
      'scheduleEvaluation'
    );
  });


  it("should get capabilities with get element function", async ({skip}) => {
    skip(containerCapabilities === null, "Capacities not initialized");
    assert(containerCapabilities !== null);
    const originalCapabilities = containerCapabilities;
    containerCapabilities = null;
    await originalCapabilities.getElement([ '#', 'runtime', 'C1' ] as ElementPath);
    expect(containerCapabilities).to.be.instanceof(Object);
    expect(containerCapabilities).to.have.all.keys(
      'getPath',
      'getChild',
      'getParent',
      'getElement',
      'scheduleEvaluation'
    );
  });

  it("should get element path with capabilities", async ({skip}) => {
    skip(containerCapabilities === null, "Capacities not initialized");
    expect(containerCapabilities).not.to.equal(null);
    assert(containerCapabilities !== null);
    expect(containerCapabilities.getPath()).to.deep.equal([ '#', 'runtime', 'C1' ]);
  });

  it("should get child with capabilities", async ({skip}) => {
    skip(containerCapabilities === null, "Capacities not initialized");
    expect(containerCapabilities).not.to.equal(null);
    assert(containerCapabilities !== null);
    const child = await containerCapabilities.getChild('S1' as ElementName);
    expect(child).to.be.instanceOf(Object);
    expect(child).have.property('elementName', 'S1');
    if (child === null) throw new Error();
    expect(child.parentPath).have.deep.equal([ '#', 'runtime', 'C1' ]);
  });

  it("should get parent with capabilities", async ({skip}) => {
    skip(containerCapabilities === null, "Capacities not initialized");
    expect(containerCapabilities).not.to.equal(null);
    assert(containerCapabilities !== null);
    const parent = await containerCapabilities.getParent();
    expect(parent).to.be.instanceOf(Object);
    expect(parent).have.property('elementName', 'runtime');
  });

  it("should get element with capabilities", async ({skip}) => {
    skip(containerCapabilities === null, "Capacities not initialized");
    assert(containerCapabilities !== null);
    const element = await containerCapabilities.getElement([ '#', 'runtime'] as ElementPath);
    expect(element).to.be.instanceOf(Object);
    expect(element).have.property('elementName', 'runtime');
  });

  it("should schedule evaluation with capabilities", async ({skip}) => {
    skip(sinkCapabilities === null, "Capacities not initialized");
    assert(sinkCapabilities !== null);
    customTime = 123456;
    engine.setTimeFunction(customTimeFunction);
    skip(sinkCapabilities === null, "Capacities not initialized");
    assert(sinkCapabilities !== null);
    await sinkCapabilities.scheduleEvaluation('abc', customTime+1 as MtzMessageTime);
  });

  it("should find the schedule evaluation message", async () => {
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
    expect(message.elementPath).to.deep.equal([ '#', 'runtime', 'C1', 'S1' ]);
  });

  it("should process the waiting message", async () => {
    customTime = 123457;
    await engine.runOnce();
  });

  it("should have not waiting message", async () => {
    const messageQueueElement = await engine.getElement(['#', 'system', 'message-queue'] as ElementPath);
    expect(messageQueueElement).to.be.instanceof(Object);
    expect(messageQueueElement).to.have.property('data')
    expect(messageQueueElement.data).to.have.property('messages')
    const messages = messageQueueElement?.data?.messages ?? null;
    assert(messages !== null);
    expect(messages).to.be.instanceOf(Array);
    expect(messages.length).to.equal(0);
  });

  it("should have received evaluation data", async () => {
    expect(evaluationData).to.equal('abc');
  });

});

