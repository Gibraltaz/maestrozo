import { describe, it, expect } from "vitest";
import { Engine } from "@/main";

describe("Type manager", () => {

    it("check data type container", () => {
        const e = new Engine();
        const root = e.getRootElement();
        expect(root).toHaveProperty('children');
        expect(root.children).toBeInstanceOf(Array);

        // root.types container
        const typeContainer = root.getElementByName('types');
        expect(typeContainer).toBeInstanceOf(Object);
        expect(typeContainer).toHaveProperty('name', 'types');
        expect(typeContainer).toHaveProperty('kind', 'type');
        expect(typeContainer).toHaveProperty('path');
        expect(typeContainer.path).deep.equals(['types']);

        // root.types.data
        const dataTypeContainer = typeContainer.getElementByName('data');
        expect(dataTypeContainer).toBeInstanceOf(Object);
        expect(dataTypeContainer).toHaveProperty('name', 'data');
        expect(dataTypeContainer).toHaveProperty('kind', 'type-container');
        expect(dataTypeContainer.path).deep.equals(['types', 'data']);

        // root.types.data.integer
        let dataType = dataTypeContainer.getElementByName('integer');
        expect(dataType).toBeInstanceOf(Object);
        expect(dataType).toHaveProperty('name', 'integer');
        expect(dataType).toHaveProperty('kind', 'type');
        expect(dataType.path).deep.equals(['types', 'data', 'integer']);

        // root.types.data.string
        dataType = dataTypeContainer.getElementByName('string');
        expect(dataType).toBeInstanceOf(Object);
        expect(dataType).toHaveProperty('name', 'string');
        expect(dataType).toHaveProperty('kind', 'type');
        expect(dataType.path).deep.equals(['types', 'data', 'string']);

        // root.types.data.boolean
        dataType = dataTypeContainer.getElementByName('boolean');
        expect(dataType).toBeInstanceOf(Object);
        expect(dataType).toHaveProperty('name', 'boolean');
        expect(dataType).toHaveProperty('kind', 'type');
        expect(dataType.path).deep.equals(['types', 'data', 'boolean']);

    });
});
