/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect, assert, beforeAll, afterAll } from "vitest";

import { FileStore } from "../src/store/FileStore";

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { rm } from "node:fs/promises";
import { MtzElement, ElementName, ElementPath } from "@/Element";

const tmpFilePath = (prefix:string) =>join( tmpdir(), `${prefix}-${randomUUID()}.tmp`);

describe("File store", () => {

  let storePath: string;
  let fileStore1: FileStore | null;
  let fileStore2: FileStore | null;

  beforeAll( () => {
    storePath = tmpFilePath('maestrozo')
  });

  afterAll( async () => {
    await rm(storePath);
  });

  it("should create a first instance of file store", () => {
    fileStore1 = new FileStore(storePath);
  });

  it("should not be initialized", () => {
    assert (fileStore1 !== null);
    expect(fileStore1).to.have.property('initialized', false);
  });

  it("should initialize file store", async () => {
    assert (fileStore1 !== null);
    await fileStore1.initialize();
  });

  it("should be initialized", () => {
    assert (fileStore1 !== null);
    expect(fileStore1).to.have.property('initialized', true);
  });

  describe("Initialize first file store", () => {
    it("should create a first instance of file store", () => {
      fileStore1 = new FileStore(storePath);
    });

    it("should not be initialized", () => {
      assert (fileStore1 !== null);
      expect(fileStore1).to.have.property('initialized', false);
    });

    it("should initialize file store", async () => {
      assert (fileStore1 !== null);
      await fileStore1.initialize();
    });

    it("should be initialized", () => {
      assert (fileStore1 !== null);
      expect(fileStore1).to.have.property('initialized', true);
    });

    it("should store a first new element", async ({skip}) => {
      skip(fileStore1 === null, "File store not initialized");
      assert(fileStore1 !== null);
      const element: MtzElement = {
        elementName: 'element-1' as ElementName,
        parentPath: [ '#' ] as ElementPath,
        revision: 1,
        elementType: [ '#', 'types', 'xxx' ] as ElementPath,
        isContainer: false,
        isVolatile: false,
        data: { value: 'abc' },
        childNames: null
      };
      await fileStore1.setElement(element);
    });

    it("should store a second new element", async ({skip}) => {
      skip(fileStore1 === null, "File store not initialized");
      assert(fileStore1 !== null);
      const element: MtzElement = {
        elementName: 'element-2' as ElementName,
        parentPath: [ '#' ] as ElementPath,
        revision: 1,
        elementType: [ '#', 'types', 'xxx' ] as ElementPath,
        isContainer: false,
        isVolatile: false,
        data: { value: 'def' },
        childNames: null
      };
      await fileStore1.setElement(element);
    });


    it("should retrieve the first element", async ({skip}) => {
      skip(fileStore1 === null, "Store not initialized");
      assert(fileStore1 !== null);
      const element = await fileStore1.getElement([ '#', 'element-1' ] as ElementPath);
      expect(element).not.to.equal(null);
      assert(element !== null);
      expect(element).to.be.instanceOf(Object);
      expect(element).to.have.property('elementName', 'element-1');
      expect(element).to.have.property('revision', 1);
      expect(element).to.have.property('parentPath');
      expect(element.parentPath).to.deep.equal([ '#' ]);
      expect(element).to.have.property('data');
      expect(element.data).to.have.property('value', 'abc');
    });

    it("should retrieve the second element", async ({skip}) => {
      skip(fileStore1 === null, "Store not initialized");
      assert(fileStore1 !== null);
      const element = await fileStore1.getElement([ '#', 'element-2' ] as ElementPath);
      expect(element).not.to.equal(null);
      assert(element !== null);
      expect(element).to.be.instanceOf(Object);
      expect(element).to.have.property('elementName', 'element-2');
      expect(element).to.have.property('revision', 1);
      expect(element).to.have.property('parentPath');
      expect(element.parentPath).to.deep.equal([ '#' ]);
      expect(element).to.have.property('data');
      expect(element.data).to.have.property('value', 'def');
    });


    it("should update first element", async ({skip}) => {
      skip(fileStore1 === null, "Store not initialized");
      assert(fileStore1 !== null);
      const element = await fileStore1.getElement([ '#', 'element-1' ] as ElementPath);
      assert(element !== null);
      assert(element.data !== null);
      element.data.value = 'ABC';
      element.revision++;
      await fileStore1.setElement(element);
      expect(element.revision).to.equal(2);
    });

    it("should update second element", async ({skip}) => {
      skip(fileStore1 === null, "Store not initialized");
      assert(fileStore1 !== null);
      const element = await fileStore1.getElement([ '#', 'element-2' ] as ElementPath);
      assert(element !== null);
      assert(element.data !== null);
      element.data.value = 'DEF';
      element.revision++;
      await fileStore1.setElement(element);
      expect(element.revision).to.equal(2);
    });


    it("should retrieve change in first element", async ({skip}) => {
      skip(fileStore1 === null, "Store not initialized");
      assert(fileStore1 !== null);
      const element = await fileStore1.getElement([ '#', 'element-1' ] as ElementPath);
      expect(element).not.to.equal(null);
      assert(element !== null);
      expect(element).to.be.instanceOf(Object);
      expect(element).to.have.property('elementName', 'element-1');
      expect(element).to.have.property('revision', 2);
      expect(element).to.have.property('parentPath');
      expect(element.parentPath).to.deep.equal([ '#' ]);
      expect(element).to.have.property('data');
      expect(element.data).to.have.property('value', 'ABC');
    });

    it("should retrieve change in second element", async ({skip}) => {
      skip(fileStore1 === null, "Store not initialized");
      assert(fileStore1 !== null);
      const element = await fileStore1.getElement([ '#', 'element-2' ] as ElementPath);
      expect(element).not.to.equal(null);
      assert(element !== null);
      expect(element).to.be.instanceOf(Object);
      expect(element).to.have.property('elementName', 'element-2');
      expect(element).to.have.property('revision', 2);
      expect(element).to.have.property('parentPath');
      expect(element.parentPath).to.deep.equal([ '#' ]);
      expect(element).to.have.property('data');
      expect(element.data).to.have.property('value', 'DEF');
    });


    it("should not find an non existent element", async ({skip}) => {
      skip(fileStore1 === null, "Store not initialized");
      assert(fileStore1 !== null);
      const element = await fileStore1.getElement([ '#', 'non-existent-element' ] as ElementPath);
      expect(element).to.equal(null);
    });

    it("should free first instance of file store", () => {
      fileStore1 = null;
    });
  });

  describe("Initialize second file store with same file", () => {

    it("should create a second instance of file store with same file", () => {
      fileStore2 = new FileStore(storePath);
    });

    it("should not be initialized", ({skip}) => {
      skip(fileStore2 === null, "Store not initialized");
      assert (fileStore2 !== null);
      expect(fileStore2).to.have.property('initialized', false);
    });

    it("should initialize file store", async ({skip}) => {
      skip(fileStore2 === null, "Store not initialized");
      assert (fileStore2 !== null);
      await fileStore2.initialize();
    });

    it("should be initialized", ({skip}) => {
      skip(fileStore2 === null, "Store not initialized");
      assert (fileStore2 !== null);
      expect(fileStore2).to.have.property('initialized', true);
    });

    it("should retrieve first element", async ({skip}) => {
      skip(fileStore2 === null, "Store not initialized");
      assert(fileStore2 !== null);
      const element = await fileStore2.getElement([ '#', 'element-1' ] as ElementPath);
      expect(element).not.to.equal(null);
      assert(element !== null);
      expect(element).to.be.instanceOf(Object);
      expect(element).to.have.property('elementName', 'element-1');
      expect(element).to.have.property('revision', 2);
      expect(element).to.have.property('parentPath');
      expect(element.parentPath).to.deep.equal([ '#' ]);
      expect(element).to.have.property('data');
      expect(element.data).to.have.property('value', 'ABC');
    });

  });

});
