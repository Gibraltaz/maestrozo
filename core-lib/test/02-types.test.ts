import { describe, it, expect } from "vitest";
import { Engine } from "@/main";
import { ElementName } from '@/interfaces/IElement';

describe("Type manager", () => {

    it("check data type container", () => {
        const e = new Engine();
        const root = e.getRootElement();
        expect(root).toHaveProperty('children');
        expect(root.children).toBeInstanceOf(Array);

        // root.types container
        const typeContainer = root.typesContainer;
        expect(typeContainer).toBeInstanceOf(Object);
        expect(typeContainer).toHaveProperty('name', 'types');
        expect(typeContainer).toHaveProperty('kind', 'types-root');
        expect(typeContainer).toHaveProperty('path');
        expect(typeContainer.path).deep.equals(['types']);

        // root.types.data
        const dataTypeContainer = typeContainer.dataTypeContainer;
        expect(dataTypeContainer).toBeInstanceOf(Object);
        expect(dataTypeContainer).toHaveProperty('name', 'data');
        expect(dataTypeContainer).toHaveProperty('kind', 'type-container');
        expect(dataTypeContainer.path).deep.equals(['types', 'data']);

        // root.types.data.integer
        let dataType = dataTypeContainer.getElementByName('integer' as ElementName);
        expect(dataType).toBeInstanceOf(Object);
        expect(dataType).toHaveProperty('name', 'integer');
        expect(dataType).toHaveProperty('kind', 'data-type');
        expect(dataType.path).deep.equals(['types', 'data', 'integer']);

        // root.types.data.string
        dataType = dataTypeContainer.getElementByName('string' as ElementName);
        expect(dataType).toBeInstanceOf(Object);
        expect(dataType).toHaveProperty('name', 'string');
        expect(dataType).toHaveProperty('kind', 'data-type');
        expect(dataType.path).deep.equals(['types', 'data', 'string']);

        // root.types.data.boolean
        dataType = dataTypeContainer.getElementByName('boolean' as ElementName);
        expect(dataType).toBeInstanceOf(Object);
        expect(dataType).toHaveProperty('name', 'boolean');
        expect(dataType).toHaveProperty('kind', 'data-type');
        expect(dataType.path).deep.equals(['types', 'data', 'boolean']);

    });
});
