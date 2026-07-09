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
      [ 'runtime' ] as ElementPath,
      [ 'types', 'components', 'constant' ] as ElementPath,
      {
        'dataType': [ 'types', 'data', 'integer' ],
        'value': 123
      }
    );
    //expect(component).to.be.instanceof(Object);
    //expect(component).to.have.property('elementName', 'constantA');
    //expect(component).to.have.property('parentPath');
    //expect(component.parentPath).to.deep.equal(['runtime']);
    //expect(component).to.have.property('elementType');
    //expect(component.elementType).to.deep.equal([ 'types', 'data', 'integer']);
  });


 
});
