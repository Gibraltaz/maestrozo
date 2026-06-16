import { IContainer } from '@/interfaces/IContainer';
import { IPinConnection, IPinConnectionFactory } from '@/interfaces/IPinConnection';
import { IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { ComponentName, ComponentPath, ElementName, InputPinName, OutputPinName } from '@/global/types';

interface IRuntimeContainer extends IContainer {

  createComponent(
    componentName: ElementName,
    componentFactory: IComponentFactory,
    params: Record<string, any>
  ): IComponent;

  createPinConnection(
    sourceComponentName: ComponentName, sourcePinName: OutputPinName,
    targetComponentName: ComponentName, targetPinName: InputPinName,
    pinConnectionFactory: IPinConnectionFactory
  ): IPinConnection;

  getComponentByName(componentName: ComponentName): IComponent;
  getComponentByPath(componentPath: ComponentPath): IComponent | undefined;

};

export { IRuntimeContainer };
