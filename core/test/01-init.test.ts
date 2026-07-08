import { describe, it, expect } from "vitest";
import { MaestrozoCore } from "@/MaestrozoCore";

describe("Engine initialization", () => {
    it("check engine version", () => {
        const e = new MaestrozoCore();
        expect(e.version).toBe('0.0.1');
    });

});
