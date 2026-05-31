import { ITypeFactory } from '@/interfaces/ITypeFactory';
import { ElementName, ElementPath } from '@/interfaces/IElement';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { Message } from './MessageQueue';

interface IComponentFactory extends ITypeFactory {
  createInstance(componentName: ElementName, parentElementPath: ElementPath,params: Record<string, unknown>): IComponent;
  evaluateComponent(component: IComponent, message: Message) : EvaluationResult;
}

export { IComponentFactory };
