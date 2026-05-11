import { describe, it, expect } from "vitest";
import { Engine, somme } from "@/main";

describe("Engine initialization", () => {
    it("check engine version", () => {
        const e = new Engine();
        expect(e.version).toBe('0.0.1');
    });

    it("check root element", () => {
        const e = new Engine();
        const r = e.getRootElement();

        expect (r).toHaveProperty('name');
        expect(r.name).toBe('root');

        expect (r).toHaveProperty('kind');
        expect(r.kind).toBe('root');

        expect (r).toHaveProperty('children');
        expect(r.children).toBeInstanceOf(Array);
    });

});
