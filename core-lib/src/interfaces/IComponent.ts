import { IElement, ElementName, ElementPath } from '@/interfaces/IElement';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { IPinContainer } from '@/interfaces/IPinContainer';
import { Message } from './MessageQueue';


type ComponentName = ElementName & { __brand2: 'ComponentName' };
type ComponentPath = ElementPath;
type PinName = ElementName & { __brand2: 'Pin' };
type InputPinName = PinName & { __brand3: 'InputPin' };
type OutputPinName = PinName & { __brand3: 'OutputPin' };

type EvaluationResult = {
  setOutputs: Array<{
    pin: OutputPinName;
    value: unknown;
  }>;
};

interface IComponent extends IElement {
  readonly factory: IComponentFactory;
  readonly inputPins : IPinContainer;
  readonly outputPins: IPinContainer;
  evaluate(message: Message): EvaluationResult;
}

export { IComponent, ComponentName, ComponentPath, PinName, InputPinName, OutputPinName, EvaluationResult };
