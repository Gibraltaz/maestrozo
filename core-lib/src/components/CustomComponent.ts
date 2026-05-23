import { IComponent } from '@/interfaces/IComponent';
import { ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { InputPinContainer, OutputPinContainer } from '@/PinContainer';

class CustomComponent implements IComponent {
  name: ElementName;
  kind: ElementKind;
  path: ElementPath;
  factory: IComponentFactory;
  inputPins : InputPinContainer;
  outputPins: OutputPinContainer;

  constructor(elementName: ElementName, elementKind: ElementKind, parentElementPath: ElementPath, factory: IComponentFactory) {
    this.name = elementName;
    this.kind = elementKind;
    this.path = [ ...parentElementPath, elementName ];
    this.factory = factory;
    this.inputPins  = new InputPinContainer(this.path);
    this.outputPins = new OutputPinContainer(this.path);
  }

}

export { CustomComponent };
