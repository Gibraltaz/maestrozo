/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { ElementName, ElementPath, Engine } from "@/Engine";
import { MemoryStore } from "@/store/MemoryStore";

describe("Maestrozo core", () => {
  let engine = new Engine();

  it("should be initialized", async() => {
    await engine.initialize(new MemoryStore());
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
    expect(component).to.have.property('elementName', 'constantA');
    expect(component).to.have.property('parentPath');
    expect(component.parentPath).to.deep.equal(['#', 'runtime']);
    expect(component).to.have.property('elementType');
    expect(component.elementType).to.deep.equal([ '#', 'types', 'components', 'constant']);
    expect(component).to.have.property('data');
    expect(component).to.have.property('isContainer', false);
    expect(component).to.have.property('isVolatile', false);
    expect(component.data).to.be.instanceof(Object);
    expect(component.data).to.have.property('value', 123);
    expect(component).to.have.property('childNames', null);
  });

  it("should find newly created component in runtime", async () => {
    const component = await engine.getElement(['#' as ElementName, 'runtime' as ElementName, 'constantA' as ElementName]);
    expect(component).to.be.instanceof(Object);
    expect(component).to.have.property('revision', 1);
    expect(component).to.have.property('elementName', 'constantA');
    expect(component).to.have.property('parentPath');
    expect(component.parentPath).to.deep.equal(['#', 'runtime']);
    expect(component).to.have.property('elementType');
    expect(component.elementType).to.deep.equal([ '#', 'types', 'components', 'constant']);
    expect(component).to.have.property('isContainer', false);
    expect(component).to.have.property('isVolatile', false);
    expect(component).to.have.property('data');
    expect(component.data).to.be.instanceof(Object);
    expect(component.data).to.have.property('value', 123);
    expect(component).to.have.property('childNames', null);
  });

  it("should find newly created component as a child of runtime", async () => {
    const runtimeContainer = await engine.getElement(['#' as ElementName, 'runtime' as ElementName]);
    expect(runtimeContainer).to.have.property('childNames');
    expect(runtimeContainer.childNames).to.deep.equal(['constantA']);
  });

  it("should not create a component with the same name", async () => {
    await expect(
      engine.createElement(
        'constantA' as ElementName,
        [ '#', 'runtime' ] as ElementPath,
        [ '#', 'types', 'components', 'constant' ] as ElementPath,
        {
          'dataType': [ '#', 'types', 'data', 'integer' ],
          'value': 123
        }
      )
    ).rejects.toThrow("Element «/#/runtime/constantA» already exists");
  });

  it("should not create a component in a non-existent container", async () => {
    await expect(
      engine.createElement(
        'constantX' as ElementName,
        [ '#', 'runtime', 'xxx' ] as ElementPath,
        [ '#', 'types', 'components', 'constant' ] as ElementPath,
        {
          'dataType': [ '#', 'types', 'data', 'integer' ],
          'value': 123
        }
      )
    ).rejects.toThrow("Parent element «/#/runtime/xxx» does not exist");
  });


  it("should not create a component in non-container component", async () => {
    await expect(
      engine.createElement(
        'constantX' as ElementName,
        [ '#', 'runtime', 'constantA' ] as ElementPath,
        [ '#', 'types', 'components', 'constant' ] as ElementPath,
        {
          'dataType': [ '#', 'types', 'data', 'integer' ],
          'value': 123
        }
      )
    ).rejects.toThrow("Parent element «/#/runtime/constantA» is not a container");
  });

});
