import { IDataFactory } from '@/interfaces/IDataFactory';
import { ElementName } from '@/interfaces/IElement';
import { IData } from '@/interfaces/IData';

class BooleanData implements IData {
  dataFactory : IDataFactory;
  value: boolean;

  constructor (factory : IDataFactory , value : boolean) {
    this.dataFactory = factory;
    this.value = value;
  }
}

class BooleanDataFactory implements IDataFactory {
  typeName = 'boolean' as ElementName;

  createInstance(params: Record<string, unknown>): IData {
    const booleanValue = params['value'];
    if (booleanValue === undefined )
      throw new Error("Value parameter is not defined");
    if (typeof(booleanValue) !== 'boolean')
      throw new Error("Value parameter is not a boolean");
    const booleanData = new BooleanData(this, booleanValue);
    return booleanData;
  }

}

export { BooleanDataFactory, BooleanData };
