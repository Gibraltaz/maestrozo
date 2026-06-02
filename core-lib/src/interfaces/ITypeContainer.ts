import { IDataFactory } from '@/interfaces/IDataFactory';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { IContainer } from '@/interfaces/IContainer';
import { DataTypeElement } from '@/DataTypeElement';
import { ComponentTypeElement } from '@/ComponentTypeElement';

interface ITypeContainer extends IContainer {
  declareDataType(dataFactory : IDataFactory) : DataTypeElement;
  declareComponentType(componentFactory : IComponentFactory) : ComponentTypeElement;
};

export { ITypeContainer };
