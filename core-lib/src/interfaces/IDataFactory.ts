import { ElementName } from '@/interfaces/IElement';
import { IData } from '@/interfaces/IData';

interface IDataFactory {
  name: ElementName;
  createInstance(params: Record<string, unknown>): IData;
}

export { IDataFactory };
