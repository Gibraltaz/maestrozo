/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { ElementName, ElementPath, Engine } from "@/Engine";
import { RawMemoryStore } from "@/store/RawMemoryStore";

describe("Maestrozo core", () => {
  let engine = new Engine(new RawMemoryStore());

  it("should create a constant component in runtime", () => {
    const component = engine.createElement(
      'constantA' as ElementName,
      [ '#', 'runtime' ] as ElementPath,
      [ '#', 'types', 'components', 'constant' ] as ElementPath,
      {
        'dataType': [ '#', 'types', 'data', 'integer' ],
        'value': 123
      }
    );
    expect(component).to.be.instanceof(Object);
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
  });

  it("should find newly created component in runtime", () => {
    const component = engine.getElement(['#' as ElementName, 'runtime' as ElementName, 'constantA' as ElementName]);
    expect(component).to.be.instanceof(Object);
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
  });

  it("should not create a component with the same name", () => {
    expect( () => {
      engine.createElement(
        'constantA' as ElementName,
        [ '#', 'runtime' ] as ElementPath,
        [ '#', 'types', 'components', 'constant' ] as ElementPath,
        {
          'dataType': [ '#', 'types', 'data', 'integer' ],
          'value': 123
        }
      );
    }).to.throw("Element «/#/runtime/constantA» already exists");
  });

  it("should not create a component in a non-existent container", () => {
    expect( () => {
      engine.createElement(
        'constantX' as ElementName,
        [ '#', 'runtime', 'xxx' ] as ElementPath,
        [ '#', 'types', 'components', 'constant' ] as ElementPath,
        {
          'dataType': [ '#', 'types', 'data', 'integer' ],
          'value': 123
        }
      );
    }).to.throw("Parent element «/#/runtime/xxx» does not exist");
  });


  it("should not create a component in non-container component", () => {
    expect( () => {
      engine.createElement(
        'constantX' as ElementName,
        [ '#', 'runtime', 'constantA' ] as ElementPath,
        [ '#', 'types', 'components', 'constant' ] as ElementPath,
        {
          'dataType': [ '#', 'types', 'data', 'integer' ],
          'value': 123
        }
      );
    }).to.throw("Parent element «/#/runtime/constantA» is not a container");
  });

});
