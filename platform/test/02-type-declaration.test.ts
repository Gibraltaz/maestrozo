/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";

import { ElementPath } from "@maestrozo/kernel";

import { MaestrozoPlatform, maestrozoPlatform } from "../src/platform";

describe("Maestrozo platform", async () => {
  let platform: MaestrozoPlatform | null = null;

  it("should instanciate platform", async () => {
    platform = await maestrozoPlatform();
    expect(platform).to.be.instanceOf(Object);
  });

  it("should find /types/plugin", async ({skip}) => {
    skip(platform === null, "Platform not initialized");
    assert(platform !== null);
    const element = await platform.getElement([ '#', 'types', 'plugin'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'plugin');
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('parentPath')
    expect(element.parentPath).to.deep.equal([ '#', 'types' ]);
    expect(element).to.have.property('elementType')
    expect(element.elementType).to.deep.equal([ '#', 'types', 'type' ]);
    expect(element).to.have.property('data');
    expect(element.data).to.have.property('typeHandler');
  });

  it("should find /types/user", async ({skip}) => {
    skip(platform === null, "Platform not initialized");
    assert(platform !== null);
    const element = await platform.getElement([ '#', 'types', 'user'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'user');
    expect(element).to.have.property('isContainer', false);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('parentPath')
    expect(element.parentPath).to.deep.equal([ '#', 'types' ]);
    expect(element).to.have.property('elementType')
    expect(element.elementType).to.deep.equal([ '#', 'types', 'type' ]);
    expect(element).to.have.property('data');
    expect(element.data).to.have.property('typeHandler');
  });

  it("should find /registry", async ({skip}) => {
    skip(platform === null, "Platform not initialized");
    assert(platform !== null);
    const element = await platform.getElement([ '#', 'registry'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('revision', 2);
    expect(element).to.have.property('elementName', 'registry');
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', false);
    expect(element).to.have.property('parentPath')
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('elementType')
    expect(element.elementType).to.deep.equal([ '#', 'types', 'container' ]);
  });

  it("should find /registry/users", async ({skip}) => {
    skip(platform === null, "Platform not initialized");
    assert(platform !== null);
    const element = await platform.getElement([ '#', 'registry', 'users'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'users');
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', false);
    expect(element).to.have.property('parentPath')
    expect(element.parentPath).to.deep.equal([ '#', 'registry' ]);
    expect(element).to.have.property('elementType')
    expect(element.elementType).to.deep.equal([ '#', 'types', 'container' ]);
  });

  it("should find /platform", async ({skip}) => {
    skip(platform === null, "Platform not initialized");
    assert(platform !== null);
    const element = await platform.getElement([ '#', 'platform'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('revision', 3);
    expect(element).to.have.property('elementName', 'platform');
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('parentPath')
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('elementType')
    expect(element.elementType).to.deep.equal([ '#', 'types', 'container' ]);
  });

  it("should find /platform/plugins", async ({skip}) => {
    skip(platform === null, "Platform not initialized");
    assert(platform !== null);
    const element = await platform.getElement([ '#', 'platform', 'plugins'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'plugins');
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('parentPath')
    expect(element.parentPath).to.deep.equal([ '#', 'platform' ]);
    expect(element).to.have.property('elementType')
    expect(element.elementType).to.deep.equal([ '#', 'types', 'container' ]);
  });

  it("should find /platform/authenticators", async ({skip}) => {
    skip(platform === null, "Platform not initialized");
    assert(platform !== null);
    const element = await platform.getElement([ '#', 'platform', 'authenticators'] as ElementPath);
    expect(element).not.to.equal(null);
    assert(element !== null);
    expect(element).to.be.instanceOf(Object);
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'authenticators');
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', true);
    expect(element).to.have.property('parentPath')
    expect(element.parentPath).to.deep.equal([ '#', 'platform' ]);
    expect(element).to.have.property('elementType')
    expect(element.elementType).to.deep.equal([ '#', 'types', 'container' ]);
  });

});
