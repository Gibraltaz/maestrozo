/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MaestrozoPlatform, maestrozoPlatform } from "../src/platform";

describe("Maestrozo platform", async () => {
  let platform: MaestrozoPlatform | null = null;

  it("should instanciate platform", async () => {
    platform = await maestrozoPlatform();
    expect(platform).to.be.instanceOf(Object);
  });

  it("should check version", ({skip}) => {
    skip(platform === null, "Platform not initialized");
    assert(platform !== null);
    expect(platform).to.have.property('version', '0.0.1');
  });

  it("should accept to run", async ({skip}) => {
    skip(platform === null, "Platform not initialized");
    assert(platform !== null);
    platform.runOnce();
  });

});
