import { Message } from '@/global/messages';
import { ElementKind, ElementName, ElementPath } from '@/global/types';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { InputPinContainer, OutputPinContainer } from '@/PinContainer';
import { elementPathAreEquals, pathToString } from '@/utils/path';

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

  evaluate(message: Message): EvaluationResult {
    if (! elementPathAreEquals(message.componentPath, this.path)) {
      const msgPath = pathToString(message.componentPath);
      const cmpPath = pathToString(this.path);
      throw new Error(`The message component path «${msgPath}» does not match the component path ${cmpPath}`);
    }
    return this.factory.evaluateComponent(this, message);
  }

}

export { CustomComponent };
