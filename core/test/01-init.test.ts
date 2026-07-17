/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MtzCore } from "@/Core";

describe("Maestrozo core", () => {
  let maestrozoCore = new MtzCore();

  it("should check engine version", () => {
    expect(maestrozoCore).to.have.property('version', '0.0.1');
  });

  it("should not be initialized at startup", async () => {
    expect(maestrozoCore).to.have.property('initialized', false);
  });

  it("should not accept to run when not initialized", async () => {
    await expect(
     maestrozoCore.runOnce()
    ).rejects.toThrow("Core not initialized");
  });


  it("should accept to be initialized", async () => {
    await maestrozoCore.initialize();
  });

  it("should be initialized", async () => {
    expect(maestrozoCore).to.have.property('initialized', true);
  });

  // TODO à activer
  //it("should not accept to run when not initialized", async () => {
  //  await expect(
  //   maestrozoCore.runOnce()
  //  ).rejects.toThrow("Core not initialized");
  //});

});
