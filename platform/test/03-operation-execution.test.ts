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

  it("should execute single operation", async ({skip}) => {
    skip(platform === null);
    assert(platform !== null);
    const operation:MtzCreateElementOperation = {
      type: MtzOperationType.ElementCreation,
      elementName: 'test01' as ElementName,
      parentPath: [ '#', 'runtime' ] as ElementPath,
    };
    platform.execute(operation);
  });

    
});
