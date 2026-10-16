/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MaestrozoPlatform, maestrozoPlatform } from "../src/platform";
import { ElementPath } from "maestrozo-kernel";

describe("Maestrozo platform", async () => {
  let platform: MaestrozoPlatform | null = null;

  it("should instanciate platform", async () => {
    platform = await maestrozoPlatform();
    expect(platform).to.be.instanceOf(Object);
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
    expect(element).to.have.property('revision', 1);
    expect(element).to.have.property('elementName', 'registry');
    expect(element).to.have.property('isContainer', true);
    expect(element).to.have.property('isVolatile', false);
    expect(element).to.have.property('parentPath')
    expect(element.parentPath).to.deep.equal([ '#' ]);
    expect(element).to.have.property('elementType')
    expect(element.elementType).to.deep.equal([ '#', 'types', 'container' ]);
  });


});
