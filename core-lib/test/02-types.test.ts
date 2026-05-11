import { describe, it, expect } from "vitest";
import { Engine } from "@/main";

describe("Type manager", () => {

    it("check type container", () => {
        const e = new Engine();
        const root = e.getRootElement();
        expect(root).toHaveProperty('children');
        expect(root.children).toBeInstanceOf(Array);

        // root.types container
        const typeContainer = root.getElementByName('types');
        expect(typeContainer).toBeInstanceOf(Object);
        expect(typeContainer).toHaveProperty('name', 'types');
        expect(typeContainer).toHaveProperty('kind', 'type');

        // root.types.data
        const dataTypeContainer = typeContainer.getElementByName('data');
        expect(dataTypeContainer).toBeInstanceOf(Object);
        expect(dataTypeContainer).toHaveProperty('name', 'data');
        expect(dataTypeContainer).toHaveProperty('kind', 'type-container');

        // root.types.data.integer
        let dataType = dataTypeContainer.getElementByName('integer');
        expect(dataType).toBeInstanceOf(Object);
        expect(dataType).toHaveProperty('name', 'integer');
        expect(dataType).toHaveProperty('kind', 'type');

        // root.types.data.string
        dataType = dataTypeContainer.getElementByName('string');
        expect(dataType).toBeInstanceOf(Object);
        expect(dataType).toHaveProperty('name', 'string');
        expect(dataType).toHaveProperty('kind', 'type');

        // root.types.data.boolean
        dataType = dataTypeContainer.getElementByName('boolean');
        expect(dataType).toBeInstanceOf(Object);
        expect(dataType).toHaveProperty('name', 'boolean');
        expect(dataType).toHaveProperty('kind', 'type');

    });
});
