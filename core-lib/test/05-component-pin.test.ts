import { describe, it, expect } from "vitest";
import { Engine } from '@/Engine';
import { ElementName } from '@/global/types';

describe("Component pin", () => {
    it("check pin type container", () => {
        const e = new Engine();
        const root = e.getRootElement();
        expect(root).toHaveProperty('children');
        expect(root.children).toBeInstanceOf(Array);

        // root.types container
        const typeContainer = root.typesContainer;

        // root.types.pin
        const pinTypeContainer = typeContainer.pinTypeContainer;
        expect(pinTypeContainer).toBeInstanceOf(Object);
        expect(pinTypeContainer).toHaveProperty('name', 'pins');
        expect(pinTypeContainer).toHaveProperty('kind', 'type-container');
        expect(pinTypeContainer.path).deep.equals(['types', 'pins']);

        // root.types.pin.input
        let pinType = pinTypeContainer.getElementByName('input-pin' as ElementName);
        expect(pinType).toBeInstanceOf(Object);
        expect(pinType).toHaveProperty('name', 'input-pin');
        expect(pinType).toHaveProperty('kind', 'pin-type');
        expect(pinType.path).deep.equals(['types', 'pins', 'input-pin']);

        // root.types.pin.output
        pinType = pinTypeContainer.getElementByName('output-pin' as ElementName);
        expect(pinType).toBeInstanceOf(Object);
        expect(pinType).toHaveProperty('name', 'output-pin');
        expect(pinType).toHaveProperty('kind', 'pin-type');
        expect(pinType.path).deep.equals(['types', 'pins', 'output-pin']);

    });

});
