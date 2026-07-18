/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { ElementName, ElementPath, Engine } from "@/Engine";
import { MemoryStore } from "@/store/MemoryStore";

describe("Maestrozo core", () => {
  const memoryStore = new MemoryStore();
  let engine = new Engine();
  let componentRef1: MtzElement;
  let componentRef2: MtzElement;

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

  it("should obtain a first reference to the component", async () => {
    componentRef1 = await engine.getElement(['#' as ElementName, 'runtime' as ElementName, 'constantA' as ElementName]);
    expect(componentRef1).to.be.instanceof(Object);
  });

  it("should obtain a second reference to the component", async () => {
    componentRef2 = await engine.getElement(['#' as ElementName, 'runtime' as ElementName, 'constantA' as ElementName]);
    expect(componentRef1).to.be.instanceof(Object);
  });

  it("should have two differents instances", async () => {
    expect(componentRef1).not.to.equal(componentRef2);
  });

  it("should modifiy component with first instance", async () => {
    componentRef1.data.value = 456;
    await engine.modifyElement(componentRef1);
    expect(componentRef1.revision).to.equal(2);
  });

  it("should detect conflict edition when trying to change second instance", async () => {
    componentRef2.data.value = 789;
    await expect(
      engine.modifyElement(componentRef2)
    ).rejects.toThrow("Conflict in edition of element «/#/runtime/constantA»");
  });


});
