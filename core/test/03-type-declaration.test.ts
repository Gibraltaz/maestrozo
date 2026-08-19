/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { ElementPath, MtzEngine } from "@/Engine";
import { MemoryStore } from "@/store/MemoryStore";

describe("Maestrozo core", () => {
  let engine = new MtzEngine()

  it("should be initialized", async () => {
    await engine.initialize(new MemoryStore());
    expect(engine).to.have.property('initialized', true)
  });

  it("should find root «/» element", async () => {
    const element = await engine.getElement(['#'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', '#');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([]);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'container']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', false);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(['types', 'runtime', 'system']);
  });

  it("should find /types element", async () => {
    const element = await engine.getElement(['#', 'types'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'types');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'container']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal([
      'data', 'components', 'pins', 'links', 
      'type', 'element', 'container',
      'message-queue', 'message'
    ]);
  });

  it("should find /types/type", async () => {
    const element = await engine.getElement(['#', 'types', 'type'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'type');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });


  it("should find /types/element", async () => {
    const element = await engine.getElement(['#', 'types', 'element'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'element');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/container", async () => {
    const element = await engine.getElement(['#', 'types', 'container'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'container');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/data", async () => {
    const element = await engine.getElement(['#', 'types', 'data'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'data');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'container']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(['integer', 'string', 'boolean']);
  });

  it("should find /types/data/integer", async () => {
    const element = await engine.getElement(['#', 'types', 'data', 'integer'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'integer');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'data']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/data/string", async () => {
    const element = await engine.getElement(['#', 'types', 'data', 'string'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'string');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'data']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/data/boolean", async () => {
    const element = await engine.getElement(['#', 'types', 'data', 'boolean'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'boolean');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'data']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/pins", async () => {
    const element = await engine.getElement(['#', 'types', 'pins'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'pins');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'container']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(['input-pin', 'output-pin']);
  });

  it("should find /types/pins/input-pin", async () => {
    const element = await engine.getElement(['#', 'types', 'pins', 'input-pin'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'input-pin');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'pins']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/pins/output-pin", async () => {
    const element = await engine.getElement(['#', 'types', 'pins', 'output-pin'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'output-pin');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'pins']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/links", async () => {
    const element = await engine.getElement(['#', 'types', 'links'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'links');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'container']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(['connection']);
  });

  it("should find /types/links/connection", async () => {
    const element = await engine.getElement(['#', 'types', 'links', 'connection'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'connection');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'links']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });



  it("should find /types/components", async () => {
    const element = await engine.getElement(['#', 'types', 'components'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'components');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'container']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(['constant', 'variable']);
  });

  it("should find /types/components/constant", async () => {
    const element = await engine.getElement(['#', 'types', 'components', 'constant'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'constant');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'components']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/components/variable", async () => {
    const element = await engine.getElement(['#', 'types', 'components', 'variable'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'variable');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'types', 'components']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/message", async () => {
    const element = await engine.getElement(['#', 'types', 'message'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'message');
    expect(element).to.have.property('parentPath');
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/message-queue", async () => {
    const element = await engine.getElement(['#', 'types', 'message-queue'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'message-queue');
    expect(element).to.have.property('parentPath');
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'type']);
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element.childNames).to.deep.equal(null);
  });

  it("should find /types/runtime", async () => {
    const element = await engine.getElement(['#', 'runtime'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'runtime');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'container']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', false);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal([]);
  });

  it("should find /types/system", async () => {
    const element = await engine.getElement(['#', 'system'] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'system');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal(['#', 'types', 'container']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', false);
    expect(element).to.have.property('childNames');
    expect(element.childNames).to.deep.equal(['message-queue']);
  });

  it("should find /system/message-queue", async () => {
    const element = await engine.getElement(['#', 'system', 'message-queue'] as ElementPath);
    expect(element).not.to.equal(null);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'message-queue');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['#', 'system']);
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', false);
  });

});
