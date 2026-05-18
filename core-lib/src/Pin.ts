import { IPin, IPinFactory } from '@/interfaces/IPin';
import { IElement, ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { AbstractContainer } from './AbstractContainer';
import { ITypeFactory } from './interfaces/ITypeFactory';
import { ITypeElement } from './interfaces/ITypeElement';

const PinTypeElementKind : ElementKind = 'pin-type' as ElementKind;

const inputPinTypeName  : ElementName = 'input-pin' as ElementName;
const inputPinTypeKind : ElementKind = 'input-pin-type' as ElementKind;

const outputPinTypeName : ElementName = 'output-pin' as ElementName;
const outputPinTypeKind : ElementKind = 'output-pin-type' as ElementKind;

class PinTypeElement extends AbstractContainer implements ITypeElement {

  factory : ITypeFactory;

  constructor(factory: ITypeFactory, parentElementPath: ElementPath) {
    super(factory.name, PinTypeElementKind, parentElementPath);
    this.factory = factory;
  }

  createPin(): IPin {
    const pinFactory = this.factory as IPinFactory;
    const pin = pinFactory.createInstance();
    if (pin === undefined)
      throw new Error("Pin was not created");
    return pin;
  }

}

abstract class Pin implements IPin {
  readonly name: ElementName;
  readonly kind: ElementKind;
  readonly path: ElementPath;
  protected _children : Record<ElementName, IElement> = {};

  constructor(elementName: ElementName, elementKind: ElementKind, parentElementPath: ElementPath) {
    this.name = elementName;
    this.kind = elementKind;
    this.path = [ ...parentElementPath, elementName ];
  }

  get children() : readonly IElement[] {
    return Object.values(this._children);
  }

}

class InputPin extends Pin {
  constructor(componentPath: ElementPath) {
    super(inputPinTypeName, inputPinTypeKind, componentPath);
  }
}

class InputPinFactory implements IPinFactory {
  name = 'input-pin' as ElementName;
  createInstance(componentPath: ElementPath): IPin {
    return new InputPin(componentPath);
  }

}

class OutputPin extends Pin {
  constructor(componentPath: ElementPath) {
    super(outputPinTypeName, outputPinTypeKind, componentPath);
  }
}

class OutputPinFactory implements IPinFactory {
  name = 'output-pin' as ElementName;
  createInstance(componentPath: ElementPath): IPin {
    return new OutputPin(componentPath);
  }
}

export {
  Pin, PinTypeElement,
  inputPinTypeName, inputPinTypeKind, InputPin, InputPinFactory,
  outputPinTypeName, outputPinTypeKind, OutputPin, OutputPinFactory,
};
