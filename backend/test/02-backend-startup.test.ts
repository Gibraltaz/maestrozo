/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { backendJsonGet, startMaestrozoBackend, stopMaestrozoBackend, testConfig } from './helpers/backend.js';


describe("Maestrozo core", async () => {

  it("should start Maestrozo backend", async () => {
    await startMaestrozoBackend()
  }, 10000);

  it("should request root API", async () => {
    const res = await backendJsonGet('', {});
    expect(res).not.to.equal(null);
    expect(res).to.be.instanceOf(Object);
    expect(res).to.have.property('name', testConfig?.general.name);
    expect(res).to.have.property('description', testConfig?.general.description);
  });

  it("should stop Maestrozo backend", async () => {
    await stopMaestrozoBackend()
  });

});
