/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { IElement  } from '@/interfaces/IElement';
import { IData } from '@/interfaces/IData';
import { IDataFactory } from '@/interfaces/IDataFactory';
import { ElementName, ElementPath } from '@/global/types';

type PinName = ElementName;
type InputPinName = PinName;
type OutputPinName = PinName;

interface IPin extends IElement, IData {
}

interface IInputPin extends IPin {
}

interface IOutputPin extends IPin {
}

interface IPinFactory {
  typeName : ElementName;
  createInstance(pinName: ElementName, pinContainerPath: ElementPath, dataFactory: IDataFactory, params: Record<string, unknown>): IPin;
};

export {
  IPin, 
  IInputPin,
  IOutputPin,
  IPinFactory,
  PinName,
  InputPinName,
  OutputPinName
}
