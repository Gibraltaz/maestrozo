import { describe, it, expect } from "vitest";
import { Engine, somme } from "@/main";

describe("Initialization", () => {
    it("check engine version", () => {
        const e = new Engine();
        expect(e.version).toBe('0.0.1');
    });
});
