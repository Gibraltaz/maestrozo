import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { IComponent } from '@/interfaces/IComponent';

const fakeElementKind: ElementKind = 'fake-component' as ElementKind;

class FakeComponent implements IComponent {
  name: ElementName;
  kind: ElementKind;
  path: ElementPath;
  factory : IComponentFactory;

  constructor (componentName: ElementName, parentElementPath: ElementPath, factory : IComponentFactory ) {
    this.name = componentName;
    this.kind = fakeElementKind;
    this.path = [ ...parentElementPath, componentName ];
    this.factory = factory;
  }
}

class FakeComponentFactory implements IComponentFactory {
  name = 'fake-component' as ElementName;

  createInstance(componentName: ElementName, parentElementPath: ElementPath,params: Record<string, unknown>): IComponent {
    const fakeComponent = new FakeComponent(componentName, parentElementPath, this);
    return fakeComponent;
  }

}

export { FakeComponentFactory, FakeComponent };
