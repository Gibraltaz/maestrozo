import { IPinContainer } from '@/interfaces/IPinContainer';
import { IPin } from '@/interfaces/IPin';
import { IDataFactory } from '@/interfaces/IDataFactory';
import { IElement, ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { InputPin, inputPinTypeKind, OutputPin, outputPinTypeKind }  from '@/Pin';
import { DataTypeElement } from "@/DataTypeElement";

const inputPinContainerName : ElementName = 'input-pins' as ElementName;
const inputPinContainerType : ElementKind = 'input-pin-container' as ElementKind;

const outputPinContainerName : ElementName = 'output-pins' as ElementName;
const outputPinContainerType : ElementKind = 'output-pin-container' as ElementKind;


class PinContainer implements IPinContainer {
  name: ElementName;
  kind: ElementKind;
  path: ElementPath;

  protected _children : Record<ElementName, IElement> = {};

  constructor(elementName: ElementName, elementKind: ElementKind, parentElementPath: ElementPath) {
    this.name = elementName;
    this.kind = elementKind;
    if (parentElementPath === undefined)
      throw new Error("Parent element path not defined");
    this.path = [ ...parentElementPath, elementName ];
    this._children = {};
  }

  get children() : readonly IElement[] {
    return Object.values(this._children);
  }

  protected addChild(element: IElement) {
    if (this._children[element.name] !== undefined)
      throw new Error("Element is already in this container");
    this._children[element.name] = element;
  }

  getElementByName(elementName: ElementName): IElement {
    const element = this._children[elementName];
    if (element === undefined)
      throw new Error(`Element «${elementName}» not found in container «${this.name}»`);
    return element;
  }

  getPinByName(pinName: ElementName) : IPin {
    return this.getElementByName(pinName) as IPin;
  }

  get pins() : IPin[] {
    return Object.values(this._children) as IPin[];
  }

  protected declarePin(pinName: ElementName, pinKind: ElementKind, dataFactory: IDataFactory, params: Record<string, unknown>) : IPin {
    if (this._children[pinName] !== undefined)
      throw new Error(`Pin «${pinName} already exists in component`);
    let newPin: IPin;
    switch(pinKind) {
      case inputPinTypeKind:
        newPin = new InputPin(pinName, this.path, dataFactory);
        break;
      case outputPinTypeKind:
        newPin = new OutputPin(pinName, this.path, dataFactory);
        break;
      default:
        throw new Error(`Invalid pin type «${pinKind}»`);
    }
    newPin.value = dataFactory.createInstance(params);
    this._children[pinName] = newPin;
    return newPin;
  }
}

class InputPinContainer extends PinContainer {
  constructor(parentElementPath: ElementPath) {
    super(inputPinContainerName,  inputPinContainerType, parentElementPath);
  }

  declareInputPin(pinName: ElementName, dataType: DataTypeElement, params: Record<string, unknown>) : IPin {
    const dataFactory = dataType.factory as IDataFactory;
    return this.declarePin(pinName, inputPinTypeKind, dataFactory, params);
  }
}

class OutputPinContainer extends PinContainer {
  constructor(parentElementPath: ElementPath) {
    super(outputPinContainerName, outputPinContainerType, parentElementPath);
  }

  declareOutputPin(pinName: ElementName, dataType: DataTypeElement, params: Record<string, unknown>) : IPin {
    const dataFactory = dataType.factory as IDataFactory;
    return this.declarePin(pinName, outputPinTypeKind, dataFactory, params);
  }
}

export { PinContainer, InputPinContainer, OutputPinContainer };
