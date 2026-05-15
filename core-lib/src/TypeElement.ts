import { IElement, ElementKind, ElementPath} from '@/interfaces/IElement';
import { IData } from '@/interfaces/IData';
import { AbstractContainer } from './AbstractContainer';
import { IDataFactory } from '@/interfaces/IDataFactory';

const TypeElementKind : ElementKind = 'type' as ElementKind;

class TypeElement extends AbstractContainer{

  protected factory : IDataFactory;

  constructor(factory: IDataFactory, parentElementPath: ElementPath) {
    super(factory.name, TypeElementKind, parentElementPath);
    this.factory = factory;
  }

  createData(params: Record<string, unknown>): IData {
    const value = params['value'];
    if (value === undefined)
      throw new Error("Value parameter is not defined");
    const data = this.factory.createInstance(params);
    if (data === undefined)
      throw new Error("Data was not created");
    return data;
  }

}

export { TypeElement, TypeElementKind };
