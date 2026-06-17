import { AbstractContainer } from '@/AbstractContainer';
import { Message } from '@/global/messages';
import { ComponentName, ElementKind, ElementName, ElementPath, PinName } from '@/global/types';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { IPin } from '@/interfaces/IPin';
import { componentKind, inputPinKind, outputPinKind } from '@/global/kinds';
import { IElement } from '@/interfaces/IElement';
import { IDataFactory } from '@/interfaces/IDataFactory';
import { InputPin, OutputPin } from '@/Pin';
import { DataTypeElement } from '@/DataTypeElement';

class AbstractComponent extends AbstractContainer implements IComponent {
  factory: IComponentFactory;

  constructor(componentName: ComponentName, parentElementPath: ElementPath, factory: IComponentFactory) {
    super(componentName, componentKind, parentElementPath);
    this.factory = factory;
  }

  getPinByName(pinName: PinName) : IPin {
    const pinElement = this.getElementByName(pinName);
    if (pinElement.kind !== outputPinKind && pinElement.kind !== inputPinKind)
      throw new Error(`Source «${pinName}» is not an pin`);
    return pinElement as IPin;
  }

  getInputPinByName(pinName: PinName) : IPin {
    const pinElement = this.getElementByName(pinName);
    if (pinElement.kind !== inputPinKind)
      throw new Error(`Source «${pinName}» is not an input pin`);
    return pinElement as IPin;
  }

  getOutputPinByName(pinName: PinName) : IPin {
    const pinElement = this.getElementByName(pinName);
    if (pinElement.kind !== outputPinKind)
      throw new Error(`Source «${pinName}» is not an output pin`);
    return pinElement as IPin;
  }

  get pins() : IPin[] {
    return (Object.values(this._children).filter( 
       (pin: IElement) => (pin.kind === inputPinKind || pin.kind === outputPinKind))
    ) as IPin[];
  }

  get inputPins() : IPin[] {
    return (Object.values(this._children).filter(
      (pin: IElement) => pin.kind === inputPinKind)
    ) as IPin[];
  }

  get outputPins() : IPin[] {
    return (Object.values(this._children).filter(
      (pin: IElement) => pin.kind === outputPinKind)
    ) as IPin[];
  }

  protected declarePin(newPin: IPin, dataFactory: IDataFactory, params: Record<string, unknown>) : IPin {
    if (this._children[newPin.name] !== undefined)
      throw new Error(`Pin «${newPin.name} already exists in component`);
    newPin.value = dataFactory.createInstance(params);
    this._children[newPin.name] = newPin;
    return newPin;
  }

  declareInputPin(pinName: ElementName, dataType: DataTypeElement, params: Record<string, unknown>) : IPin {
    const dataFactory = dataType.factory as IDataFactory;
    const newPin = new InputPin(pinName, this.path, dataFactory);
    return this.declarePin(newPin, dataFactory, params);
  }

  declareOutputPin(pinName: ElementName, dataType: DataTypeElement, params: Record<string, unknown>) : IPin {
    const dataFactory = dataType.factory as IDataFactory;
    const newPin = new OutputPin(pinName, this.path, dataFactory);
    return this.declarePin(newPin, dataFactory, params);
  }

  evaluate(_message: Message): EvaluationResult {
    throw new Error("Abstract function not implemented"); 
  }

}

export { AbstractComponent };
