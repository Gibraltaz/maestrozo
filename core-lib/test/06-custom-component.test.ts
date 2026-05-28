import { describe, it, expect, beforeAll } from "vitest";
import { Engine } from '@/Engine';
import { IComponent } from '@/interfaces/IComponent';
import { ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { ITypeElement } from '@/interfaces/ITypeElement';
import { RootElement } from "@/RootElement";
import { CustomComponent } from "@/components/CustomComponent";
import { IComponentFactory } from "@/interfaces/IComponentFactory";
import { DataTypeElement } from "@/DataTypeElement";
import { IntegerData } from '@/data/IntegerData';
import { StringData } from '@/data/StringData';
import { BooleanData } from '@/data/BooleanData';
import { CustomComponentBuilder } from '@/components/CustomComponentBuilder';

const myCustomElementKind : ElementKind = 'my-custom-component' as ElementKind;

type PinDeclaration = {
  name: ElementName;
  dataType: DataTypeElement;
  initialValuePropertyName: string; //FIXME mettre un type «PropertyName»
};

class MyCustomComponent extends CustomComponent {
}

class MyCustomComponentFactory implements IComponentFactory{
  typeName = 'my-custom-component' as ElementName;

  inputPinDeclarations: PinDeclaration[];
  outputPinDeclarations: PinDeclaration[];

  constructor(engine : Engine) {
    const dataTypeContainer = engine.getRootElement().typesContainer.dataTypeContainer;
    this.inputPinDeclarations = [
      {
        name:'boolean-input' as ElementName, 
        dataType: dataTypeContainer.getElementByName('boolean' as ElementName) as DataTypeElement,
        initialValuePropertyName: 'value'
      },
    ];

    this.outputPinDeclarations = [
      {
        name:'integer-output' as ElementName, 
        dataType: dataTypeContainer.getElementByName('integer' as ElementName) as DataTypeElement,
        initialValuePropertyName: 'value'
      },
      {
        name:'string-output' as ElementName, 
        dataType: dataTypeContainer.getElementByName('string' as ElementName) as DataTypeElement,
        initialValuePropertyName: 'value'
      },
    ];

  }

  createInstance(componentName: ElementName, parentElementPath: ElementPath, params: Record<string, unknown>): IComponent {
    const newComponent = new MyCustomComponent(componentName, myCustomElementKind,  parentElementPath, this);

    for (const pinDeclaration of this.inputPinDeclarations) {
      const pinParameters = params[pinDeclaration.name] as Record<string, unknown>;
      if (! pinParameters)
        throw new Error(`Parameter section «${pinDeclaration.name}» is not defined in component «${this.typeName} factory»`);
      newComponent.inputPins.declareInputPin(pinDeclaration.name, pinDeclaration.dataType, pinParameters );
    }

    for (const pinDeclaration of this.outputPinDeclarations) {
      const pinParameters = params[pinDeclaration.name] as Record<string, unknown>;
      if (! pinParameters)
        throw new Error(`Parameter section «${pinDeclaration.name}» is not defined in component «${this.typeName} factory»`);
      newComponent.outputPins.declareOutputPin(pinDeclaration.name, pinDeclaration.dataType, pinParameters );
    }

    return newComponent;
  }

}

describe("Custom component", () => {
  let engine : Engine;
  let root : RootElement;

  beforeAll(() => {
    engine = new Engine();
    root = engine.getRootElement();
  });

  describe("Build a component from scratch", () => {

    it("should declare a custom component", () => {
      const componentTypeContainer = root.typesContainer.componentTypeContainer;
      componentTypeContainer.declareComponentType(new MyCustomComponentFactory(engine));
    });

    it("should find the custom component type", () => {
      const componentTypeContainer = root.typesContainer.componentTypeContainer;
      const myCustomComponentType = componentTypeContainer.getElementByName('my-custom-component' as ElementName) as ITypeElement;
      expect(myCustomComponentType).toBeInstanceOf(Object);
      expect(myCustomComponentType).toHaveProperty('name', 'my-custom-component');
      expect(myCustomComponentType).toHaveProperty('kind', 'component-type');
      expect(myCustomComponentType).toHaveProperty('factory');
      const myCustomComponentFactory = myCustomComponentType.factory;
      expect(myCustomComponentFactory).toBeInstanceOf(Object);
      expect(myCustomComponentFactory).toHaveProperty('typeName', 'my-custom-component');
    });

    it("should instanciate the custom component", () => {
      const runtimeContainer = root.runtimeContainer;
      const componentTypeContainer = root.typesContainer.componentTypeContainer;
      const myCustomComponentType = componentTypeContainer.getElementByName('my-custom-component' as ElementName) as ITypeElement;
      const myCustomComponentFactory = myCustomComponentType.factory as IComponentFactory;
      const myCustomComponent = runtimeContainer.createComponent(
        'my-custom-component-01' as ElementName,
        myCustomComponentFactory,
        {
          'boolean-input' : { 'value': true },
          'integer-output' : { 'value': 5 },
          'string-output'  : { 'value': 'abc' }
        }
      );
      const newComponent = engine.getRootElement().runtimeContainer.components.getElementByName('my-custom-component-01' as ElementName) as IComponent;
      expect(newComponent).to.deep.equal(myCustomComponent);

      expect(myCustomComponent).toBeInstanceOf(Object);
      expect(myCustomComponent).toHaveProperty('name', 'my-custom-component-01');
      expect(myCustomComponent).toHaveProperty('kind', 'my-custom-component');
      expect(myCustomComponent.path).deep.equals(['runtime', 'components', 'my-custom-component-01']);
      expect(myCustomComponent).toHaveProperty('factory');
      expect(myCustomComponent.factory).toBeInstanceOf(Object);

      expect(myCustomComponent).toHaveProperty('inputPins');
      expect(myCustomComponent.factory).toBeInstanceOf(Object);
      const inputPinContainer = myCustomComponent.inputPins;
      expect(inputPinContainer).toHaveProperty('name', 'input-pins');
      expect(inputPinContainer).toHaveProperty('kind', 'input-pin-container');
      expect(inputPinContainer.path).deep.equals(['runtime', 'components', 'my-custom-component-01', 'input-pins']);
      expect(inputPinContainer).toHaveProperty('pins');
      const inputPinArray = inputPinContainer.pins;
      expect(inputPinArray).toBeInstanceOf(Array);
      expect(inputPinArray.length).toEqual(1);

      let pin = inputPinArray[0];
      expect(pin).toBeInstanceOf(Object);
      expect(pin).toHaveProperty('name', 'boolean-input');
      expect(pin).toHaveProperty('kind', 'input-pin-type');
      expect(pin).toHaveProperty('path');
      expect(pin.path).deep.equals(['runtime', 'components', 'my-custom-component-01', 'input-pins', 'boolean-input']);
      expect(pin).toHaveProperty('value');
      let pinValue = pin.value;
      expect(pinValue).to.be.instanceOf(BooleanData);
      expect(pinValue).toHaveProperty('value');
      expect(pinValue.value).to.equal(true);

      expect(myCustomComponent).toHaveProperty('outputPins');
      expect(myCustomComponent.factory).toBeInstanceOf(Object);
      const outputPinContainer = myCustomComponent.outputPins;
      expect(outputPinContainer).toHaveProperty('name', 'output-pins');
      expect(outputPinContainer).toHaveProperty('kind', 'output-pin-container');
      expect(outputPinContainer.path).deep.equals(['runtime', 'components', 'my-custom-component-01', 'output-pins']);
      expect(outputPinContainer).toHaveProperty('pins');
      const outputPinArray = outputPinContainer.pins;
      expect(outputPinArray).toBeInstanceOf(Array);
      expect(outputPinArray.length).toEqual(2);

      pin = outputPinArray[0];
      expect(pin).toBeInstanceOf(Object);
      expect(pin).toHaveProperty('name', 'integer-output');
      expect(pin).toHaveProperty('kind', 'output-pin-type');
      expect(pin).toHaveProperty('path');
      expect(pin.path).deep.equals(['runtime', 'components', 'my-custom-component-01', 'output-pins', 'integer-output']);
      expect(pin).toHaveProperty('value');
      pinValue = pin.value;
      expect(pinValue).to.be.instanceOf(IntegerData);
      expect(pinValue).toHaveProperty('value');
      expect(pinValue.value).to.equal(5);

      pin = outputPinArray[1];
      expect(pin).toBeInstanceOf(Object);
      expect(pin).toHaveProperty('name', 'string-output');
      expect(pin).toHaveProperty('kind', 'output-pin-type');
      expect(pin).toHaveProperty('path');
      expect(pin.path).deep.equals(['runtime', 'components', 'my-custom-component-01', 'output-pins', 'string-output']);
      pinValue = pin.value;
      expect(pinValue).to.be.instanceOf(StringData);
      expect(pinValue).toHaveProperty('value');
      expect(pinValue.value).to.equal('abc');
    });
  });

  describe("Build a component with component builder", () => {

    let myComponentBuilder: CustomComponentBuilder;

    it("should declare component builder", () => {
      const componentTypeContainer = root.typesContainer.componentTypeContainer;
      const dataTypeContainer = engine.getRootElement().typesContainer.dataTypeContainer;

      const inputPinDeclarations = [
        {
          name:'boolean-input' as ElementName, 
          dataType: dataTypeContainer.getElementByName('boolean' as ElementName) as DataTypeElement,
          initialValuePropertyName: 'value'
        },
      ];

      const outputPinDeclarations = [
        {
          name:'integer-output' as ElementName, 
          dataType: dataTypeContainer.getElementByName('integer' as ElementName) as DataTypeElement,
          initialValuePropertyName: 'value'
        }
      ];

      myComponentBuilder = new CustomComponentBuilder(
        'my-other-custom-component' as ElementName,
        inputPinDeclarations,
        outputPinDeclarations,
        componentTypeContainer
      );

      expect(myComponentBuilder).to.be.instanceOf(Object);

    });

    it("should find the custom component type", () => {
      const componentTypeContainer = root.typesContainer.componentTypeContainer;
      const myCustomComponentType = componentTypeContainer.getElementByName('my-other-custom-component' as ElementName) as ITypeElement;
      expect(myCustomComponentType).toBeInstanceOf(Object);
      expect(myCustomComponentType).toHaveProperty('name', 'my-other-custom-component');
      expect(myCustomComponentType).toHaveProperty('kind', 'component-type');
      expect(myCustomComponentType).toHaveProperty('factory');
      const myCustomComponentFactory = myCustomComponentType.factory;
      expect(myCustomComponentFactory).toBeInstanceOf(Object);
      expect(myCustomComponentFactory).toHaveProperty('typeName', 'my-other-custom-component');
    });

    it("should instanciate the custom component type", () => {
      const runtimeContainer = root.runtimeContainer;
      const componentTypeContainer = root.typesContainer.componentTypeContainer;
      const myCustomComponentType = componentTypeContainer.getElementByName('my-other-custom-component' as ElementName) as ITypeElement;
      const myCustomComponent = runtimeContainer.createComponent(
        'my-other-custom-component-01' as ElementName,
        myCustomComponentType.factory as IComponentFactory,
        {
          inputPins: {
            'boolean-input' : { 'value': true },
          },
          outputPins : {
            'integer-output' : { 'value': 5 },
            'string-output'  : { 'value': 'abc' }
          }
        }
      );
      expect(myCustomComponent).to.be.instanceOf(Object);
      expect(myCustomComponent).to.have.property('name', 'my-other-custom-component-01');
      expect(myCustomComponent).to.have.property('kind', 'component-type');
      expect(myCustomComponent.path).deep.equals(['runtime', 'components', 'my-other-custom-component-01']);
      expect(myCustomComponentType).toHaveProperty('factory');

      const myCustomComponentFactory = myCustomComponentType.factory;
      expect(myCustomComponentFactory).toBeInstanceOf(Object);
      expect(myCustomComponentFactory).toHaveProperty('typeName', 'my-other-custom-component');

      const inputPinContainer = myCustomComponent.inputPins;
      expect(inputPinContainer).toHaveProperty('name', 'input-pins');
      expect(inputPinContainer).toHaveProperty('kind', 'input-pin-container');
      expect(inputPinContainer.path).deep.equals(['runtime', 'components', 'my-other-custom-component-01', 'input-pins']);
      expect(inputPinContainer).toHaveProperty('pins');
      const inputPinArray = inputPinContainer.pins;
      expect(inputPinArray).toBeInstanceOf(Array);
      expect(inputPinArray.length).toEqual(1);


      let pin = inputPinArray[0];
      expect(pin).toBeInstanceOf(Object);
      expect(pin).toHaveProperty('name', 'boolean-input');
      expect(pin).toHaveProperty('kind', 'input-pin-type');
      expect(pin).toHaveProperty('path');
      expect(pin.path).deep.equals(['runtime', 'components', 'my-other-custom-component-01', 'input-pins', 'boolean-input']);
      expect(pin).toHaveProperty('value');
      let pinValue = pin.value;
      expect(pinValue).to.be.instanceOf(BooleanData);
      expect(pinValue).toHaveProperty('value');
      expect(pinValue.value).to.equal(true);

    });


  });
});
