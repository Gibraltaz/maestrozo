/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MtzCore } from "@/Core";

describe("Maestrozo core", () => {
  let maestrozoCore: MtzCore;

  it("should instanciate MtzCore", () => {
    maestrozoCore = new MtzCore();
  });

  it("should check engine version", () => {
    expect(maestrozoCore.version).toBe('0.0.1');
  });

});
