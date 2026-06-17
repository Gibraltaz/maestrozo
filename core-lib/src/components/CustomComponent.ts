import { Message } from '@/global/messages';
import { ComponentName, ElementPath } from '@/global/types';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { elementPathAreEquals, pathToString } from '@/utils/path';
import { AbstractComponent } from './AbstractComponent';

class CustomComponent extends AbstractComponent implements IComponent {

  constructor(componentName: ComponentName, parentElementPath: ElementPath, factory: IComponentFactory) {
    super(componentName, parentElementPath, factory);
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
