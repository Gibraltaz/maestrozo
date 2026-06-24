import { IContainer } from '@/interfaces/IContainer';
import { IPinConnection, IPinConnectionFactory } from '@/interfaces/IPinConnection';
import { IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { ComponentName, ComponentPath, ElementName } from '@/global/types';
import { IInputPin, IOutputPin } from './IPin';

interface IRuntimeContainer extends IContainer {

  createComponent(
    componentName: ElementName,
    componentFactory: IComponentFactory,
    params: Record<string, any>
  ): IComponent;

  createPinConnection(
    sourceComponent: IComponent, sourcePin: IOutputPin,
    targetComponent: IComponent, targetPin: IInputPin,
    pinConnectionFactory: IPinConnectionFactory
  ): IPinConnection;

  getComponentByName(componentName: ComponentName): IComponent;
  getComponentByPath(componentPath: ComponentPath): IComponent | undefined;

};

export { IRuntimeContainer };
