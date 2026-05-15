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
const IntegerTypeName : ElementName = 'integer' as ElementName;
const StringTypeName  : ElementName = 'string'  as ElementName;
const BooleanTypeName : ElementName = 'boolean' as ElementName;


class RootTypeContainer extends AbstractContainer {

  constructor() {
    super(elementName, elementKind, []);

    // create element root/data
    const dataTypeContainer = new TypeContainer(DataTypeName, this.path);
    this.addChild(dataTypeContainer);

    // create elements root/data/integer, root/data/string, root/data/boolean
    dataTypeContainer.declareDataType(new IntegerDataFactory());
    dataTypeContainer.declareDataType(new StringDataFactory());
    dataTypeContainer.declareDataType(new BooleanDataFactory());
  }

}

export {
    RootTypeContainer,
    DataTypeName,
    IntegerTypeName,
    StringTypeName,
    BooleanTypeName,
};
