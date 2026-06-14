import { IElement } from '@/interfaces/IElement';
import { ComponentName, ElementName, ElementPath, InputPinName, OutputPinName } from '@/global/types';
import { PinConnectionTypeElementName } from '@/global/names';
import { PinConnectionTypeElementKind } from '@/global/kinds';

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
