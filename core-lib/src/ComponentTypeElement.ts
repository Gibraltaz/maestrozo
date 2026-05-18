import { ITypeElement } from '@/interfaces/ITypeElement';
import { ElementName, ElementKind, ElementPath} from '@/interfaces/IElement';
import { ITypeFactory } from '@/interfaces/ITypeFactory';
import { IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { AbstractContainer } from './AbstractContainer';

const ComponentTypeElementKind : ElementKind = 'component-type' as ElementKind;

class ComponentTypeElement extends AbstractContainer implements ITypeElement {

  readonly factory : ITypeFactory;

  constructor(factory: ITypeFactory, parentElementPath: ElementPath) {
    super(factory.name, ComponentTypeElementKind, parentElementPath);
    this.factory = factory;
  }

  createComponent(componentName: ElementName, parentElementPath: ElementPath, params: Record<string, unknown>): IComponent {
    const value = params['value'];
    if (value === undefined)
      throw new Error("Value parameter is not defined");
    const componentFactory = this.factory as IComponentFactory;
    const component = componentFactory.createInstance(componentName, parentElementPath, params);
    if (component === undefined)
      throw new Error("Component was not created");
    return component;
  }

}

export { ComponentTypeElement, ComponentTypeElementKind };
