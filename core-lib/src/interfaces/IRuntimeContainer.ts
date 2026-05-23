import { ElementName } from '@/interfaces/IElement';
import { IContainer } from '@/interfaces/IContainer';
import { IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';

interface IRuntimeContainer extends IContainer {
  createComponentInstance(componentName: ElementName, componentFactory: IComponentFactory, params: Record<string, any> ): IComponent;
};

export { IRuntimeContainer };
