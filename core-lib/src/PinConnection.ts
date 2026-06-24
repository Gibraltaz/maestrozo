/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { IPinConnection, IPinConnectionFactory, PinConnectionTypeElementKind } from "./interfaces/IPinConnection";
import { ITypeFactory } from '@/interfaces/ITypeFactory';
import { ITypeElement } from '@/interfaces/ITypeElement';
import { AbstractContainer } from "./AbstractContainer";
import { ComponentName, ElementKind, ElementName, ElementPath, InputPinName, OutputPinName } from "./global/types";
import { IComponent } from "./interfaces/IComponent";
import { IInputPin, IOutputPin } from "./interfaces/IPin";

const PinConnectionName: ElementName = 'pin-connection' as ElementName;
const PinConnectionKind: ElementKind = 'pin-connection' as ElementKind;


class PinConnectionTypeElement extends AbstractContainer implements ITypeElement {

  factory : ITypeFactory;

  constructor(factory: ITypeFactory, parentElementPath: ElementPath) {
    super(factory.typeName, PinConnectionTypeElementKind, parentElementPath);
    this.factory = factory;
  }

}

class PinConnection implements IPinConnection {
  readonly name: ElementName;
  readonly kind: ElementKind;
  readonly path: ElementPath;
  readonly sourceComponentName : ComponentName;
  readonly sourcePinName : OutputPinName;
  readonly targetComponentName : ComponentName;
  readonly targetPinName : InputPinName;

  constructor(
    sourceComponentName : ComponentName,
    sourcePinName : OutputPinName,
    targetComponentName : ComponentName,
    targetPinName : InputPinName,
    containerPath: ElementPath
  ) {
    const pinConnectionName: ElementName= `${sourceComponentName}:${sourcePinName}-${targetComponentName}:${targetPinName}` as ElementName;
    this.name =  pinConnectionName;
    this.kind = PinConnectionKind;
    this.path = [ ...containerPath, pinConnectionName ];
    this.sourceComponentName = sourceComponentName;
    this.sourcePinName = sourcePinName;
    this.targetComponentName = targetComponentName;
    this.targetPinName = targetPinName;
  }

  get isContainer(): boolean {
    return false;
  }

}

class PinConnectionFactory implements IPinConnectionFactory {
  typeName = PinConnectionName;

  createInstance(
    sourceComponent: IComponent, sourcePin: IOutputPin,
    targetComponent: IComponent, targetPin: IInputPin,
    containerPath: ElementPath
  ): IPinConnection {
    const pinConnection = new PinConnection(
      sourceComponent.name as ComponentName, sourcePin.name as OutputPinName,
      targetComponent.name as ComponentName, targetPin.name as InputPinName,
      containerPath
    );
    return pinConnection;
  }

};

export { PinConnectionTypeElement, PinConnection, PinConnectionFactory};
