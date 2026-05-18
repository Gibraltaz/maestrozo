import { ITypeFactory } from '@/interfaces/ITypeFactory';
import { IData } from '@/interfaces/IData';

interface IDataFactory extends ITypeFactory {
  createInstance(params: Record<string, unknown>): IData;
}

export { IDataFactory };
