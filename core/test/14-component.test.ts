/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import { MtzEngine, ElementName, ElementPath } from "@/Engine";
import { MemoryStore } from "@/store/MemoryStore";


describe("Component type", () => {
  const engine = new MtzEngine();

  it("should initialize engine", async () => {
    await engine.initialize(new MemoryStore());
    expect(engine).to.have.property('initialized', true)
  });

  it("should not create a component directly", async () => {
    await expect(
      engine.createElement(
        'component-1' as ElementName,
        [ '#', 'runtime' ] as ElementPath,
        [ '#', 'types', 'component' ] as ElementPath,
        {}
      )
    ).rejects.toThrow("Cannot instantiate component type «/#/types/component»");
  });

});
