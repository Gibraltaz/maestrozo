/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { AbstractContainer } from '@/AbstractContainer';
import { Message } from '@/global/messages';
import { ComponentName, ElementName, ElementPath, PinName } from '@/global/types';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { IInputPin, IOutputPin, IPin } from '@/interfaces/IPin';
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

  getInputPinByName(pinName: PinName) : IInputPin {
    const pinElement = this.getElementByName(pinName);
    if (pinElement.kind !== inputPinKind)
      throw new Error(`Source «${pinName}» is not an input pin`);
    return pinElement as IInputPin;
  }

  getOutputPinByName(pinName: PinName) : IOutputPin {
    const pinElement = this.getElementByName(pinName);
    if (pinElement.kind !== outputPinKind)
      throw new Error(`Source «${pinName}» is not an output pin`);
    return pinElement as IOutputPin;
  }

  get pins() : IPin[] {
    return (Object.values(this._children).filter( 
       (pin: IElement) => (pin.kind === inputPinKind || pin.kind === outputPinKind))
    ) as IPin[];
  }

  get inputPins() : IInputPin[] {
    return (Object.values(this._children).filter(
      (pin: IElement) => pin.kind === inputPinKind)
    ) as IInputPin[];
  }

  get outputPins() : IOutputPin[] {
    return (Object.values(this._children).filter(
      (pin: IElement) => pin.kind === outputPinKind)
    ) as IOutputPin[];
  }

  protected declarePin(newPin: IPin, dataFactory: IDataFactory, params: Record<string, unknown>) : IPin {
    if (this._children[newPin.name] !== undefined)
      throw new Error(`Pin «${newPin.name} already exists in component`);
    newPin.value = dataFactory.createInstance(params);
    this._children[newPin.name] = newPin;
    return newPin;
  }

  declareInputPin(pinName: ElementName, dataType: DataTypeElement, params: Record<string, unknown>) : IInputPin {
    const dataFactory = dataType.factory as IDataFactory;
    const newPin = new InputPin(pinName, this.path, dataFactory);
    return this.declarePin(newPin, dataFactory, params) as IInputPin;
  }

  declareOutputPin(pinName: ElementName, dataType: DataTypeElement, params: Record<string, unknown>) : IOutputPin {
    const dataFactory = dataType.factory as IDataFactory;
    const newPin = new OutputPin(pinName, this.path, dataFactory);
    return this.declarePin(newPin, dataFactory, params) as IOutputPin;
  }

  evaluate(_message: Message): EvaluationResult {
    throw new Error("Abstract function not implemented"); 
  }

}

export { AbstractComponent };
