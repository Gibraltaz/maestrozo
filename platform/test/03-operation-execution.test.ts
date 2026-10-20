/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { ElementName, ElementPath } from '@maestrozo/kernel';

import { MaestrozoPlatform, maestrozoPlatform } from "../src/platform.js";
import { MtzOperationType, MtzCreateElementOperation } from '../src/execution.js';

describe("Platform operation", async () => {
  let platform: MaestrozoPlatform | null = null;

  it("should instanciate platform", async () => {
    platform = await maestrozoPlatform();
    expect(platform).to.be.instanceOf(Object);
  });

  it("should execute a single operation to create an element", async ({skip}) => {
    skip(platform === null);
    assert(platform !== null);
    const operation:MtzCreateElementOperation = {
      type: MtzOperationType.ElementCreation,
      elementName: 'test01' as ElementName,
      parentPath: [ '#', 'runtime' ] as ElementPath,
      typePath: [ '#', 'types', 'component', 'constant' ] as ElementPath,
      params: { 
        dataType: ['#', 'types', 'data', 'string'],
        value: 'abc' 
      }
    };
    platform.execute(operation);
  });

  it("should find the newly created element", async ({skip}) => {
    skip(platform === null);
    assert(platform !== null);
    const element = await platform.getElement([ '#', 'runtime', 'test01' ] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.be.have.property('elementName', 'test01');
    expect(element).to.be.have.property('data');
    expect(element.data).to.be.have.property('value', 'abc');
  });

    
});
