import { ITypeElement } from '@/interfaces/ITypeElement';
import { ElementKind, ElementPath} from '@/interfaces/IElement';
import { ITypeFactory } from '@/interfaces/ITypeFactory';
import { IData } from '@/interfaces/IData';
import { IDataFactory } from '@/interfaces/IDataFactory';
import { AbstractContainer } from './AbstractContainer';

const DataTypeElementKind : ElementKind = 'data-type' as ElementKind;

class DataTypeElement extends AbstractContainer implements ITypeElement {

  factory : ITypeFactory;

  constructor(factory: ITypeFactory, parentElementPath: ElementPath) {
    super(factory.typeName, DataTypeElementKind, parentElementPath);
    this.factory = factory;
  }

  createData(params: Record<string, unknown>): IData {
    const value = params['value'];
    if (value === undefined)
      throw new Error("Value parameter is not defined");
    const dataFactory = this.factory as IDataFactory;
    const data = dataFactory.createInstance(params);
    if (data === undefined)
      throw new Error("Data was not created");
    return data;
  }

}

export { DataTypeElement, DataTypeElementKind };
