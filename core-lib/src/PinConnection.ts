import { ElementName, ElementKind, ElementPath } from "./interfaces/IElement";
import { IPinConnection, IPinConnectionFactory, PinConnectionTypeElementKind } from "./interfaces/IPinConnection";
import { ITypeFactory } from '@/interfaces/ITypeFactory';
import { ITypeElement } from '@/interfaces/ITypeElement';
import { ComponentName, InputPinName, OutputPinName } from '@/interfaces/IComponent';
import { AbstractContainer } from "./AbstractContainer";

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
  readonly sourceComponentName : ComponentName ;
  readonly sourcePinName : OutputPinName;
  readonly targetComponentName : ComponentName ;
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

}

class PinConnectionFactory implements IPinConnectionFactory {
  typeName = PinConnectionName;

  createInstance(
    sourceComponentName: ComponentName, sourcePinName: OutputPinName,
    targetComponentName: ComponentName, targetPinName: InputPinName,
    containerPath: ElementPath
  ): IPinConnection {
    const pinConnection = new PinConnection(
      sourceComponentName, sourcePinName,
      targetComponentName, targetPinName,
      containerPath
    );
    return pinConnection;
  }

};

export { PinConnectionTypeElement, PinConnection, PinConnectionFactory};
