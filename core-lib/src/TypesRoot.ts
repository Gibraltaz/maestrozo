import { ElementName, ElementPath, ElementKind } from '@/interfaces/IElement';
import { AbstractContainer } from '@/AbstractContainer';
import { TypeContainer } from '@/TypeContainer';

import { IntegerDataFactory } from '@/data/IntegerData';
import { StringDataFactory  } from '@/data/StringData';
import { BooleanDataFactory } from '@/data/BooleanData';
import { InputPinFactory, OutputPinFactory } from '@/Pin';
import { FakeComponentFactory } from '@/components/FakeComponent';
import { PinConnectionFactory } from '@/PinConnection';

const typesRootName         : ElementName = 'types'      as ElementName;
const typesRootKind         : ElementKind = 'types-root' as ElementKind;

const dataTypeName          : ElementName = 'data'       as ElementName;
const pinTypeName           : ElementName = 'pin'        as ElementName;
const componentTypeName     : ElementName = 'component'  as ElementName;
const pinConnectionTypeName : ElementName = 'connection'  as ElementName;

class TypesRoot extends AbstractContainer {
  readonly dataTypeContainer : TypeContainer;
  readonly componentTypeContainer : TypeContainer;
  readonly pinTypeContainer : TypeContainer;
  readonly pinConnectionTypeContainer : TypeContainer;

  constructor() {
    super(typesRootName, typesRootKind, [] as ElementPath);

    // create element /types/data
    const dataTypeContainer = new TypeContainer(dataTypeName, this.path);
    this.dataTypeContainer = dataTypeContainer;
    this.addChild(dataTypeContainer);

    // create elements /types/data/integer, /types/data/string, /types/data/boolean
    dataTypeContainer.declareDataType(new IntegerDataFactory());
    dataTypeContainer.declareDataType(new StringDataFactory());
    dataTypeContainer.declareDataType(new BooleanDataFactory());

    // create element /types/pin
    const pinTypeContainer = new TypeContainer(pinTypeName, this.path);
    this.pinTypeContainer = pinTypeContainer;
    this.addChild(pinTypeContainer);

    // create elements /types/pin/input-pin and /types/pin/output-pin
    pinTypeContainer.declarePinType(new InputPinFactory());
    pinTypeContainer.declarePinType(new OutputPinFactory());


    // create element /types/component
    const componentTypeContainer = new TypeContainer(componentTypeName, this.path);
    this.componentTypeContainer = componentTypeContainer;
    this.addChild(componentTypeContainer);

    // create element /types/component/fake-component
    componentTypeContainer.declareComponentType(new FakeComponentFactory());

    // create element /types/pin-connection
    const pinConnectionTypeContainer = new TypeContainer(pinConnectionTypeName, this.path);
    this.pinConnectionTypeContainer = pinConnectionTypeContainer;
    pinConnectionTypeContainer.declarePinConnectionType(new PinConnectionFactory());

  }

}

export {
    TypesRoot,
    dataTypeName,
    componentTypeName
};
