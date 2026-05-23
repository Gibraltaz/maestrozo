import { IPin, IPinFactory } from '@/interfaces/IPin';
import { IElement, ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { AbstractContainer } from '@/AbstractContainer';
import { ITypeFactory } from '@/interfaces/ITypeFactory';
import { ITypeElement } from '@/interfaces/ITypeElement';
import { IDataFactory } from '@/interfaces/IDataFactory';

const PinTypeElementKind : ElementKind = 'pin-type' as ElementKind;

const inputPinTypeName  : ElementName = 'input-pin' as ElementName;
const inputPinTypeKind : ElementKind = 'input-pin-type' as ElementKind;

const outputPinTypeName : ElementName = 'output-pin' as ElementName;
const outputPinTypeKind : ElementKind = 'output-pin-type' as ElementKind;

class PinTypeElement extends AbstractContainer implements ITypeElement {

  factory : ITypeFactory;

  constructor(factory: ITypeFactory, parentElementPath: ElementPath) {
    super(factory.typeName, PinTypeElementKind, parentElementPath);
    this.factory = factory;
  }

}

abstract class AbstractPin implements IPin {
  readonly name: ElementName;
  readonly kind: ElementKind;
  readonly path: ElementPath;
  readonly dataFactory : IDataFactory;
  readonly value: any;
  protected _children : Record<ElementName, IElement> = {};

  constructor(pinName: ElementName, elementKind: ElementKind, pinContainerPath: ElementPath, dataFactory: IDataFactory) {
    this.name = pinName;
    this.kind = elementKind;
    this.dataFactory = dataFactory;
    this.path = [ ...pinContainerPath, pinName ];
  }

  get children() : readonly IElement[] {
    return Object.values(this._children);
  }

}

class InputPin extends AbstractPin {
  constructor(pinName: ElementName, pinContainerPath: ElementPath, dataFactory:IDataFactory) {
    super(pinName, inputPinTypeKind, pinContainerPath, dataFactory);
  }
}

class InputPinFactory implements IPinFactory {
  typeName = 'input-pin' as ElementName;
  createInstance(pinName: ElementName, pinContainerPath: ElementPath, dataFactory: IDataFactory): IPin {
    return new InputPin(pinName, pinContainerPath, dataFactory);
  }
}

class OutputPin extends AbstractPin {
  constructor(pinName: ElementName, pinContainerPath: ElementPath, dataFactory:IDataFactory) {
    super(pinName, outputPinTypeKind, pinContainerPath, dataFactory );
  }
}

class OutputPinFactory implements IPinFactory {
  typeName = 'output-pin' as ElementName;
  createInstance(pinName: ElementName, pinContainerPath: ElementPath, dataFactory: IDataFactory): IPin {
    return new OutputPin(pinName, pinContainerPath, dataFactory);
  }
}

export {
  PinTypeElement,
  InputPin, InputPinFactory, inputPinTypeName, inputPinTypeKind,
  OutputPin, OutputPinFactory, outputPinTypeName, outputPinTypeKind 
};
