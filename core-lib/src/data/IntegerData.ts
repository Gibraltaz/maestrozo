import { IDataFactory } from '@/interfaces/IDataFactory';
import { IData } from '@/interfaces/IData';
import { ElementName } from '@/global/types';

class IntegerData implements IData {
  dataFactory : IDataFactory;
  value: number | null;

  constructor (factory : IDataFactory , value : number | null) {
    this.dataFactory = factory;
    this.value = value;
  }
}

class IntegerDataFactory implements IDataFactory {
  typeName = 'integer' as ElementName;

  createInstance(params: Record<string, unknown>): IData {
    const integerValue = params?.['value'] || null;
    if (integerValue !== null) {
      if (typeof(integerValue) !== 'number' || isNaN(integerValue))
        throw new Error("Value parameter is not a number");
    }
    const integerData = new IntegerData(this, integerValue);
    return integerData;
  }

}

export { IntegerDataFactory, IntegerData };
