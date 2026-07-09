/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MaestrozoCore } from "@/MaestrozoCore";

describe("Maestrozo core", () => {
  let maestrozoCore: MaestrozoCore;

  it("should instanciate MaestrozoCore", () => {
    maestrozoCore = new MaestrozoCore();
  });

  it("should check engine version", () => {
    expect(maestrozoCore.version).toBe('0.0.1');
  });

  it("should run once", () => {
    maestrozoCore.runOnce();
  });
});
