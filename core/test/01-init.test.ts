/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MaestrozoCore, maestrozoCore } from "../src/core";

describe("Maestrozo core", async () => {
  let core: MaestrozoCore | null = null;

  it("should instanciate platform", async () => {
    core = await maestrozoCore();
    expect(core).to.be.instanceOf(Object);
  });

  it("should check engine version", ({skip}) => {
    skip(core === null, "Core not initialized");
    assert(core !== null);
    expect(core).to.have.property('version', '0.0.1');
  });


  it("should accept to run", async ({skip}) => {
    skip(core === null, "Core not initialized");
    assert(core !== null);
    core.runOnce();
  });

});
