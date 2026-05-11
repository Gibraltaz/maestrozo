import { IContainer } from '@/interfaces/IContainer';
import { IElement, ElementName, ElementKind } from '@/interfaces/IElement';
import { TypeElement } from '@/TypeElement';
import { AbstractContainer } from '@/AbstractContainer';
import { TypeContainer } from '@/TypeContainer';

const elementName : ElementName = 'types' as ElementName;
const elementKind : ElementKind = 'type' as ElementKind;

const DataTypeName    : ElementName = 'data'    as ElementName;
const IntegerTypeName : ElementName = 'integer' as ElementName;
const StringTypeName  : ElementName = 'string'  as ElementName;
const BooleanTypeName : ElementName = 'boolean' as ElementName;


class RootTypeContainer extends AbstractContainer {

    constructor() {
        super(elementName, elementKind);
        const dataTypeContainer = new TypeContainer(DataTypeName);
        this.addChild(dataTypeContainer);
        this.declareDataType(IntegerTypeName);
        this.declareDataType(StringTypeName);
        this.declareDataType(BooleanTypeName);
    }

    declareDataType(typeName: ElementName) {
        let typeElement = new TypeElement(typeName);
        const dataTypeContainer = this._children[DataTypeName] as RootTypeContainer;
        dataTypeContainer.declareDataType(typeName);
    }
}

export {
    RootTypeContainer,
    DataTypeName,
    IntegerTypeName,
    StringTypeName,
    BooleanTypeName,
};
