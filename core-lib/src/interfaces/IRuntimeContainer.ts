import { ElementName } from '@/interfaces/IElement';
import { IContainer } from '@/interfaces/IContainer';
import { IPinConnection, IPinConnectionFactory } from '@/interfaces/IPinConnection';
import { IComponent, ComponentName, InputPinName, OutputPinName } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';

interface IComponentContainer extends IContainer {
};

interface IPinConnectionContainer extends IContainer {
};


interface IRuntimeContainer extends IContainer {

  readonly components: IComponentContainer;
  readonly pinConnections : IPinConnectionContainer;

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

};

export {
  IRuntimeContainer,
  IComponentContainer,
  IPinConnectionContainer
};
