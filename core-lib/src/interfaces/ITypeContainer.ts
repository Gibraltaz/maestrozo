import { IDataFactory } from '@/interfaces/IDataFactory';
import { IComponentFactory } from '@/interfaces/IComponentFactory';

interface ITypeContainer {
  declareDataType(dataFactory : IDataFactory) : void;
  declareComponentType(componentFactory : IComponentFactory) : void;
};

export { ITypeContainer };
