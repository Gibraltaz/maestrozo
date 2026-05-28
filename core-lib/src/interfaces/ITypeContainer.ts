import { IDataFactory } from '@/interfaces/IDataFactory';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { IContainer } from '@/interfaces/IContainer';

interface ITypeContainer extends IContainer {
  declareDataType(dataFactory : IDataFactory) : void;
  declareComponentType(componentFactory : IComponentFactory) : void;
};

export { ITypeContainer };
