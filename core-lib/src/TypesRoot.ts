import { AbstractContainer } from '@/AbstractContainer';
import { TypeContainer } from '@/TypeContainer';

import { IntegerDataFactory } from '@/data/IntegerData';
import { StringDataFactory  } from '@/data/StringData';
import { BooleanDataFactory } from '@/data/BooleanData';
import { InputPinFactory, OutputPinFactory } from '@/Pin';
import { FakeComponentFactory } from '@/components/FakeComponent';
import { PinConnectionFactory } from '@/PinConnection';
import { componentTypeContainerName, dataTypeContainerName, pinConnectionTypeContainerName, pinTypeContainerName, typesRootName } from '@/global/names';
import { typesRootKind } from './global/kinds';
import { ElementPath } from './global/types';


class TypesRoot extends AbstractContainer {
  readonly dataTypeContainer : TypeContainer;
  readonly componentTypeContainer : TypeContainer;
  readonly pinTypeContainer : TypeContainer;
  readonly pinConnectionTypeContainer : TypeContainer;

  constructor() {
    super(typesRootName, typesRootKind, [] as ElementPath);

    // create element /types/data
    const dataTypeContainer = new TypeContainer(dataTypeContainerName, this.path);
    this.dataTypeContainer = dataTypeContainer;
    this.addChild(dataTypeContainer);

    // create elements /types/data/integer, /types/data/string, /types/data/boolean
    dataTypeContainer.declareDataType(new IntegerDataFactory());
    dataTypeContainer.declareDataType(new StringDataFactory());
    dataTypeContainer.declareDataType(new BooleanDataFactory());

    // create element /types/pins
    const pinTypeContainer = new TypeContainer(pinTypeContainerName, this.path);
    this.pinTypeContainer = pinTypeContainer;
    this.addChild(pinTypeContainer);

    // create elements /types/pin/input-pin and /types/pin/output-pin
    pinTypeContainer.declarePinType(new InputPinFactory());
    pinTypeContainer.declarePinType(new OutputPinFactory());


    // create element /types/components
    const componentTypeContainer = new TypeContainer(componentTypeContainerName, this.path);
    this.componentTypeContainer = componentTypeContainer;
    this.addChild(componentTypeContainer);

    // create element /types/components/fake-component
    componentTypeContainer.declareComponentType(new FakeComponentFactory());

    // create element /types/connections
    const pinConnectionTypeContainer = new TypeContainer(pinConnectionTypeContainerName, this.path);
    this.pinConnectionTypeContainer = pinConnectionTypeContainer;
    pinConnectionTypeContainer.declarePinConnectionType(new PinConnectionFactory());

  }
}

export { TypesRoot };
