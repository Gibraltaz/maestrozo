import { IElement } from '@/interfaces/IElement';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { IPinContainer } from '@/interfaces/IPinContainer';
import { EvaluationResult } from '@/global/types';
import { Message } from '@/global/messages';

interface IComponent extends IElement {
  readonly factory: IComponentFactory;
  readonly inputPins : IPinContainer;
  readonly outputPins: IPinContainer;
  evaluate(message: Message): EvaluationResult;
}

export { IComponent, EvaluationResult };
