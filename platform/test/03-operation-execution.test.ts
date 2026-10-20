/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { ElementName, ElementPath } from '@maestrozo/kernel';

import { MaestrozoPlatform, maestrozoPlatform } from "../src/platform.js";
import { MtzOperationType, MtzCreateElementOperation, MtzDeclareTypeOperation } from '../src/execution.js';

describe("Platform operation", async () => {
  let platform: MaestrozoPlatform | null = null;

  it("should instanciate platform", async () => {
    platform = await maestrozoPlatform();
    expect(platform).to.be.instanceOf(Object);
  });

  describe("Create element operation", ()=> {
    it("should execute a single operation to create an element", async ({skip}) => {
      skip(platform === null);
      assert(platform !== null);
      const operation:MtzCreateElementOperation = {
        type: MtzOperationType.ElementCreation,
        elementName: 'test00' as ElementName,
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
      const element = await platform.getElement([ '#', 'runtime', 'test00' ] as ElementPath);
      expect(element).not.to.equal(null);
      assert(element !== null);
      expect(element).to.be.instanceOf(Object);
      expect(element).to.be.have.property('elementName', 'test00');
      expect(element).to.be.have.property('data');
      expect(element.data).to.be.have.property('value', 'abc');
    });

    it("should execute an array of operations to create elements", async ({skip}) => {
      skip(platform === null);
      assert(platform !== null);
      const operation1:MtzCreateElementOperation = {
        type: MtzOperationType.ElementCreation,
        elementName: 'test01' as ElementName,
        parentPath: [ '#', 'runtime' ] as ElementPath,
        typePath: [ '#', 'types', 'component', 'constant' ] as ElementPath,
        params: { 
          dataType: ['#', 'types', 'data', 'string'],
          value: 'def' 
        }
      };
      const operation2:MtzCreateElementOperation = {
        type: MtzOperationType.ElementCreation,
        elementName: 'test02' as ElementName,
        parentPath: [ '#', 'runtime' ] as ElementPath,
        typePath: [ '#', 'types', 'component', 'constant' ] as ElementPath,
        params: { 
          dataType: ['#', 'types', 'data', 'string'],
          value: 'ghi' 
        }
      };

      platform.execute([operation1, operation2]);
    });

     it("should find first newly created element", async ({skip}) => {
      skip(platform === null);
      assert(platform !== null);
      const element = await platform.getElement([ '#', 'runtime', 'test01' ] as ElementPath);
      expect(element).not.to.equal(null);
      assert(element !== null);
      expect(element).to.be.instanceOf(Object);
      expect(element).to.be.have.property('elementName', 'test01');
      expect(element).to.be.have.property('data');
      expect(element.data).to.be.have.property('value', 'def');
    });

    it("should find second newly created element", async ({skip}) => {
      skip(platform === null);
      assert(platform !== null);
      const element = await platform.getElement([ '#', 'runtime', 'test02' ] as ElementPath);
      expect(element).not.to.equal(null);
      assert(element !== null);
      expect(element).to.be.instanceOf(Object);
      expect(element).to.be.have.property('elementName', 'test02');
      expect(element).to.be.have.property('data');
      expect(element.data).to.be.have.property('value', 'ghi');
    });
  });

  describe("Declare type operation", ()=> {

    it("should execute a single operation to declare a new type", async ({skip}) => {
      skip(platform === null);
      assert(platform !== null);
      const operation:MtzDeclareTypeOperation = {
        type: MtzOperationType.TypeDeclaration,
        elementName: 'custom-element-A' as ElementName,
        parentPath: [ '#', 'types' ] as ElementPath,
        typePath: [ '#', 'types', 'type' ] as ElementPath,
        isDerivable: false,
        isContainer:true,
        params: { }
      };
      platform.execute(operation);
    });

    it("should find the newly created element", async ({skip}) => {
      skip(platform === null);
      assert(platform !== null);
      const element = await platform.getElement([ '#', 'types', 'custom-element-A' ] as ElementPath);
      expect(element).not.to.equal(null);
      assert(element !== null);
      expect(element).to.be.instanceOf(Object);
      expect(element).to.be.have.property('elementName', 'custom-element-A');
      expect(element).to.be.have.property('parentPath');
      expect(element.parentPath).to.deep.equal(['#', 'types']);
    });

  });

});
