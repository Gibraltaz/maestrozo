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
  });

  it("should find newly created component with revision 1", async () => {
    const component = await engine.getElement(['#' as ElementName, 'runtime' as ElementName, 'constantA' as ElementName]);
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'constantA');
    expect(component).to.have.property('revision', 1);
    expect(component.data).to.have.property('value', 123);
  });

  it("should modifiy component data (first change)", async () => {
    const element = await engine.getElement(['#' as ElementName, 'runtime' as ElementName, 'constantA' as ElementName]);
    if (element.data === null) throw new Error("Component not found");
    element.data.value = 456;
    await engine.modifyElement(element);
    expect(element.revision).to.equal(2);
  });

  it("should find newly created component with revision 2", async () => {
    const component = await engine.getElement(['#' as ElementName, 'runtime' as ElementName, 'constantA' as ElementName]);
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'constantA');
    expect(component).to.have.property('revision', 2);
    expect(component.data).to.have.property('value', 456);
  });

  it("should modifiy component data (second change)", async () => {
    const element = await engine.getElement(['#' as ElementName, 'runtime' as ElementName, 'constantA' as ElementName]);
    if (element.data === null) throw new Error("Component not found");
    element.data.value = 789;
    await engine.modifyElement(element);
    expect(element.revision).to.equal(3);
  });

  it("should find newly created component with revision 3", async () => {
    const component = await engine.getElement(['#' as ElementName, 'runtime' as ElementName, 'constantA' as ElementName]);
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('elementName', 'constantA');
    expect(component).to.have.property('revision', 3);
    expect(component.data).to.have.property('value', 789);
  });


});
