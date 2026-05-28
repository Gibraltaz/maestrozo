import { IElement, ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { ComponentName, InputPinName, OutputPinName } from '@/interfaces/IComponent';

const PinConnectionTypeElementName: ElementName = 'pin-connection' as ElementName;
const PinConnectionTypeElementKind: ElementKind = 'pin-connection-type' as ElementKind;

interface IPinConnection extends IElement {
  readonly sourceComponentName : ComponentName ;
  readonly sourcePinName : OutputPinName;
  readonly targetComponentName : ComponentName ;
  readonly targetPinName : InputPinName;
}

interface IPinConnectionFactory {
  typeName : ElementName;
  createInstance(
    sourceComponentName: ComponentName, sourcePinName: OutputPinName,
    targetComponentName: ComponentName, targetPinName: InputPinName,
    containerPath: ElementPath
  ): IPinConnection;
};


export {
  IPinConnection, IPinConnectionFactory,
  PinConnectionTypeElementName, PinConnectionTypeElementKind
};
