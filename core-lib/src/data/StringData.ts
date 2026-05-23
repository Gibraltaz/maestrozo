import { IDataFactory } from '@/interfaces/IDataFactory';
import { ElementName } from '@/interfaces/IElement';
import { IData } from '@/interfaces/IData';

class StringData implements IData {
  dataFactory : IDataFactory;
  value: string;

  constructor (factory : IDataFactory , value : string) {
    this.dataFactory = factory;
    this.value = value;
  }
}

class StringDataFactory implements IDataFactory {
  typeName = 'string' as ElementName;

  createInstance(params: Record<string, unknown>): IData {
    const stringValue = params['value'];
    if (stringValue === undefined )
      throw new Error("Value parameter is not defined");
    if (typeof(stringValue) !== 'string')
      throw new Error("Value parameter is not a string");
    const stringData = new StringData(this, stringValue);
    return stringData;
  }

}

export { StringDataFactory, StringData };
