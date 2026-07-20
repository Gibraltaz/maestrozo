/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { ElementName, ElementPath, MtzEngine } from "@/Engine";
import { MemoryStore } from "@/store/MemoryStore";

describe("Maestrozo core", () => {
  const memoryStore = new MemoryStore();
  let engine = new MtzEngine();

  it("should be initialized", async() => {
    await engine.initialize(memoryStore);
  });

  it("should create a constant component in runtime", async () => {
    const component = await engine.createElement(
      'constantA' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'components', 'constant' ] as ElementPath,
      {
        'dataType': [ '#', 'types', 'data', 'integer' ],
        'value': 123
      }
    );
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('revision', 1);
    expect(component).to.have.property('childNames');
    expect(component.childNames).to.deep.equal([ 'out:value' ]);
  });

  it("should find constant output pin with revision 1", async () => {
    const outputValue = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'constantA' as ElementName,
      'out:value' as ElementName,
    ]);
    expect(outputValue).to.be.instanceOf(Object);
    expect(outputValue).to.have.property('elementName', 'out:value');
    expect(outputValue).to.have.property('parentPath');
    expect(outputValue.parentPath).to.deep.equal([ '#', 'runtime', 'constantA' ]);
    expect(outputValue.elementType).to.deep.equal([ '#', 'types', 'pins', 'output-pin' ]);
    expect(outputValue).to.have.property('isContainer', false);
    expect(outputValue).to.have.property('isVolatile', false);
    expect(outputValue).to.have.property('childNames', null);
    expect(outputValue).to.have.property('revision', 1);
    expect(outputValue.data).to.have.property('value', 123);
  });

  it("should find output pin of newly created component with revision 1", async () => {
    const output = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'constantA' as ElementName,
      'out:value' as ElementName,
    ]);
    expect(output).to.be.instanceof(Object);
    expect(output).to.have.property('revision', 1);
    expect(output.data).to.have.property('value', 123);
  });

  it("should change output pin data (first change)", async () => {
    const element = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'constantA' as ElementName,
      'out:value' as ElementName,
    ]);
    if (element.data === null) throw new Error("Component not found");
    element.data.value = 456;
    await engine.modifyElement(element);
    expect(element.revision).to.equal(2);
  });

  it("should find output pin with revision 2", async () => {
    const element = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'constantA' as ElementName,
      'out:value' as ElementName,
    ]);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 2);
    expect(element.data).to.have.property('value', 456);
  });

  it("should modifiy output pin data (second change)", async () => {
    const element = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'constantA' as ElementName,
      'out:value' as ElementName,
    ]);
    if (element.data === null) throw new Error("Component not found");
    element.data.value = 789;
    await engine.modifyElement(element);
    expect(element.revision).to.equal(3);
  });

  it("should find ouptut pin with revision 3", async () => {
    const element = await engine.getElement([
      '#' as ElementName,
      'runtime' as ElementName,
      'constantA' as ElementName,
      'out:value' as ElementName,
    ]);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 3);
    expect(element.data).to.have.property('value', 789);
  });


});
