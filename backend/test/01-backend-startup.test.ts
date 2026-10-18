/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { startMaestrozoBackend, stopMaestrozoBackend } from './helpers/backend.js';

describe("Maestrozo core", async () => {

  it("should start Maestrozo backend", async () => {
    await startMaestrozoBackend()
  }, 10000);

  it("should stop Maestrozo backend", async () => {
    await stopMaestrozoBackend()
  });

});
