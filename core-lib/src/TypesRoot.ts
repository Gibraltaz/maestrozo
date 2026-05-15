import { ElementName, ElementKind } from '@/interfaces/IElement';
import { AbstractContainer } from '@/AbstractContainer';
import { TypeContainer } from '@/TypeContainer';

import { IDataFactory } from '@/interfaces/IDataFactory';
import { IntegerDataFactory } from '@/data/IntegerData';
import { StringDataFactory  } from '@/data/StringData';
import { BooleanDataFactory } from '@/data/BooleanData';

const elementName : ElementName = 'types' as ElementName;
const elementKind : ElementKind = 'type' as ElementKind;

const DataTypeName    : ElementName = 'data'    as ElementName;

const ComponentTypeName    : ElementName = 'component'    as ElementName;

class TypesRoot extends AbstractContainer {

  constructor() {
    super(elementName, elementKind, []);

    // create element /types/data
    const dataTypeContainer = new TypeContainer(DataTypeName, this.path);
    this.addChild(dataTypeContainer);

    // create elements /types/data/integer, /types/data/string, /types/data/boolean
    dataTypeContainer.declareDataType(new IntegerDataFactory());
    dataTypeContainer.declareDataType(new StringDataFactory());
    dataTypeContainer.declareDataType(new BooleanDataFactory());

    // create element /types/container
    const componentTypeContainer = new TypeContainer(ComponentTypeName, this.path);
    this.addChild(componentTypeContainer);
  }

}

export {
    TypesRoot,
    DataTypeName,
    ComponentTypeName,
};
