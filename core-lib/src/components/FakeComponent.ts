import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { IComponent } from '@/interfaces/IComponent';
import { InputPinContainer, OutputPinContainer } from '@/PinContainer';

const fakeElementKind: ElementKind = 'fake-component' as ElementKind;

class FakeComponent implements IComponent {
  name: ElementName;
  kind: ElementKind;
  path: ElementPath;
  factory : IComponentFactory;
  inputPins : InputPinContainer;
  outputPins: OutputPinContainer;

  constructor (componentName: ElementName, parentElementPath: ElementPath, factory : IComponentFactory ) {
    this.name = componentName;
    this.kind = fakeElementKind;
    this.path = [ ...parentElementPath, componentName ];
    this.factory = factory;
    this.inputPins  = new InputPinContainer(this.path);
    this.outputPins = new OutputPinContainer(this.path);
  }
}

class FakeComponentFactory implements IComponentFactory {
  typeName = 'fake-component' as ElementName;

  createInstance(componentName: ElementName, parentElementPath: ElementPath, _params: Record<string, unknown>): IComponent {
    const fakeComponent = new FakeComponent(componentName, parentElementPath, this);
    return fakeComponent;
  }

}

export { FakeComponentFactory, FakeComponent };
