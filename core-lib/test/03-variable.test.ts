import { describe, it, expect } from "vitest";
import { Engine } from '@/Engine';
import { DataTypeElement } from '@/DataTypeElement';
import { ElementName } from '@/interfaces/IElement';


describe("Data instanciation", () => {

  it("should create an integer data", () => {
    const engine = new Engine();
    const root = engine.getRootElement();
    expect(root).toHaveProperty('children');
    expect(root.children).toBeInstanceOf(Array);

    const dataTypeContainer = root.typesContainer.dataTypeContainer;
    const dataType = dataTypeContainer.getElementByName('integer' as ElementName) as DataTypeElement;

    const integerData = dataType.createData({ value: 5});
    expect(integerData).toBeInstanceOf(Object);
    expect(integerData).toHaveProperty('value', 5);
    expect(integerData).toHaveProperty('factory');
    const integerFactory = integerData.factory;
    expect(integerFactory).toBeInstanceOf(Object);
    expect(integerFactory).toHaveProperty('name', 'integer');
  });

  it("should create a string data", () => {
    const engine = new Engine();
    const root = engine.getRootElement();
    expect(root).toHaveProperty('children');
    expect(root.children).toBeInstanceOf(Array);

    const dataTypeContainer = root.typesContainer.dataTypeContainer;
    const dataType = dataTypeContainer.getElementByName('string' as ElementName) as DataTypeElement;

    const stringData = dataType.createData({ value: 'abc'});
    expect(stringData).toBeInstanceOf(Object);
    expect(stringData).toHaveProperty('value', 'abc');
    expect(stringData).toHaveProperty('factory');
    const stringFactory = stringData.factory;
    expect(stringFactory).toBeInstanceOf(Object);
    expect(stringFactory).toHaveProperty('name', 'string');
  });

  it("should create a boolean data", () => {
    const engine = new Engine();
    const root = engine.getRootElement();
    expect(root).toHaveProperty('children');
    expect(root.children).toBeInstanceOf(Array);

    const dataTypeContainer = root.typesContainer.dataTypeContainer;
    const dataType = dataTypeContainer.getElementByName('boolean' as ElementName) as DataTypeElement;

    const booleanData = dataType.createData({ value: true});
    expect(booleanData).toBeInstanceOf(Object);
    expect(booleanData).toHaveProperty('value', true);
    expect(booleanData).toHaveProperty('factory');
    const booleanFactory = booleanData.factory;
    expect(booleanFactory).toBeInstanceOf(Object);
    expect(booleanFactory).toHaveProperty('name', 'boolean');
  });



});
