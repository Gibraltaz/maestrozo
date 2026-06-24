/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { IElement } from '@/interfaces/IElement';
import { ComponentName, ElementName, ElementPath, InputPinName, OutputPinName } from '@/global/types';
import { PinConnectionTypeElementName } from '@/global/names';
import { PinConnectionTypeElementKind } from '@/global/kinds';
import { IComponent } from './IComponent';
import { IInputPin, IOutputPin } from './IPin';

interface IPinConnection extends IElement {
  readonly sourceComponentName : ComponentName ;
  readonly sourcePinName : OutputPinName;
  readonly targetComponentName : ComponentName ;
  readonly targetPinName : InputPinName;
}

interface IPinConnectionFactory {
  typeName : ElementName;
  createInstance(
    sourceComponent: IComponent, sourcePin: IOutputPin,
    targetComponent: IComponent, targetPin: IInputPin,
    containerPath: ElementPath
  ): IPinConnection;
};


export {
  IPinConnection, IPinConnectionFactory,
  PinConnectionTypeElementName, PinConnectionTypeElementKind
};
