import { ITypeFactory } from '@/interfaces/ITypeFactory';
import { ElementName, ElementPath } from '@/interfaces/IElement';
import { IComponent } from '@/interfaces/IComponent';

interface IComponentFactory extends ITypeFactory {
  createInstance(componentName: ElementName, parentElementPath: ElementPath,params: Record<string, unknown>): IComponent;
}

export { IComponentFactory };
