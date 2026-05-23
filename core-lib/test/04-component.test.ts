import { describe, it, expect } from "vitest";
import { Engine } from '@/Engine';
import { IComponentFactory} from '@/interfaces/IComponentFactory';
import { ITypeElement } from '@/interfaces/ITypeElement';
import { ElementName } from '@/interfaces/IElement';

describe("Component manager", () => {

  it("should find runtime root", () => {
    const engine = new Engine();
    const root = engine.getRootElement();

    // root.runtime container
    //const runtimeContainer = root.getElementByName('runtime' as ElementName);
    const runtimeContainer = root.runtimeContainer;
    expect(runtimeContainer).toBeInstanceOf(Object);
    expect(runtimeContainer).toHaveProperty('name', 'runtime');
    expect(runtimeContainer).toHaveProperty('kind', 'runtime-container');
    expect(runtimeContainer).toHaveProperty('path');
    expect(runtimeContainer.path).deep.equals(['runtime']);
    expect(runtimeContainer).deep.equal(root.getElementByName('runtime' as ElementName));
  });


  it("check component type container", () => {
    const engine = new Engine();
    const root = engine.getRootElement();
    expect(root).toHaveProperty('children');
    expect(root.children).toBeInstanceOf(Array);

    // root.types container
    //const typeContainer = root.getElementByName('types' as ElementName);
    const typeContainer = root.typesContainer;
    expect(typeContainer).toBeInstanceOf(Object);

    // root.types.component
    const componentTypeContainer = typeContainer.componentTypeContainer;
    expect(componentTypeContainer).toBeInstanceOf(Object);
    expect(componentTypeContainer).toHaveProperty('name', 'component');
    expect(componentTypeContainer).toHaveProperty('kind', 'type-container');
    expect(componentTypeContainer.path).deep.equals(['types', 'component']);
  });

  it("check component fake-component type", () => {
    const engine = new Engine();
    const root = engine.getRootElement();
    expect(root).toHaveProperty('children');
    expect(root.children).toBeInstanceOf(Array);

    const typeContainer = root.typesContainer;
    const componentTypeContainer = typeContainer.componentTypeContainer;

    const fakeComponentType= componentTypeContainer.getElementByName('fake-component' as ElementName);
    if (fakeComponentType === null)
      throw new Error("Can not find fake component type");
    expect(fakeComponentType).toBeInstanceOf(Object);
    expect(fakeComponentType).toHaveProperty('name', 'fake-component');
    expect(fakeComponentType).toHaveProperty('kind', 'component-type');
    expect(fakeComponentType.path).deep.equals(['types', 'component', 'fake-component']);

  });

  it("should instanciate a fake-component", () => {
    const engine = new Engine();
    const root = engine.getRootElement();
    expect(root).toHaveProperty('children');
    expect(root.children).toBeInstanceOf(Array);

    const runtimeContainer = root.runtimeContainer;
    const typeContainer = root.typesContainer;
    const componentTypeContainer = typeContainer.componentTypeContainer;

    const fakeComponentType = componentTypeContainer.getElementByName('fake-component' as ElementName) as ITypeElement | null;
    if (fakeComponentType === null)
      throw new Error("Can not find fake component type");
    expect(fakeComponentType).toBeInstanceOf(Object);

    const fakeComponentFactory = fakeComponentType.factory as IComponentFactory;
    expect(fakeComponentFactory).toBeInstanceOf(Object);
    expect(fakeComponentFactory).toHaveProperty('typeName', 'fake-component');

    const fakeComponent = runtimeContainer.createComponentInstance(
      'fake-component-01' as ElementName, 
      fakeComponentFactory,
      {}
    );
    expect(fakeComponent).toBeInstanceOf(Object);
    expect(fakeComponent).toHaveProperty('name', 'fake-component-01');
    expect(fakeComponent).toHaveProperty('kind', 'fake-component');
    expect(fakeComponent.path).deep.equals(['runtime', 'fake-component-01']);
    expect(fakeComponent).toHaveProperty('factory');
    expect(fakeComponent.factory).toBeInstanceOf(Object);

    expect(fakeComponent).toHaveProperty('inputPins');
    expect(fakeComponent.factory).toBeInstanceOf(Object);
    const inputPins = fakeComponent.inputPins;
    expect(inputPins).toHaveProperty('name', 'input-pins');
    expect(inputPins).toHaveProperty('kind', 'input-pin-container');
    expect(inputPins.path).deep.equals(['runtime', 'fake-component-01', 'input-pins']);

    expect(fakeComponent).toHaveProperty('outputPins');
    expect(fakeComponent.factory).toBeInstanceOf(Object);
    const outputPins = fakeComponent.outputPins;
    expect(outputPins).toHaveProperty('name', 'output-pins');
    expect(outputPins).toHaveProperty('kind', 'output-pin-container');
    expect(outputPins.path).deep.equals(['runtime', 'fake-component-01', 'output-pins']);

    const newComponent = runtimeContainer.getElementByName('fake-component-01' as ElementName);
    expect(newComponent).deep.equal(fakeComponent);

  });

});
