import { IElement, ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { AbstractContainer } from '@/AbstractContainer';
import { IRuntimeContainer } from '@/interfaces/IRuntimeContainer';
import { elementPathAreEquals, parentElementPath } from '@/utils/path';
import { IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';

const runtimeElementKind : ElementKind = 'runtime-container' as ElementKind;

class RuntimeContainer extends AbstractContainer implements IRuntimeContainer {
  readonly kind = runtimeElementKind;

  constructor(elementName: ElementName, parentElementPath: ElementPath ) {
    super(elementName, runtimeElementKind, parentElementPath);
  }

  createComponentInstance(componentName: ElementName, componentFactory: IComponentFactory, params: Record<string, any> ): IComponent {
    const newComponent = componentFactory.createInstance(componentName, this.path, params);
    this.addChild(newComponent);
    return newComponent;
  } 

}

export { RuntimeContainer, runtimeElementKind };
