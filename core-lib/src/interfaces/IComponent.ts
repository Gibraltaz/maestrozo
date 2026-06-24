import { IElement } from '@/interfaces/IElement';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { ElementName, EvaluationResult } from '@/global/types';
import { Message } from '@/global/messages';
import { IInputPin, IOutputPin, IPin } from './IPin';

interface IComponent extends IElement {
  readonly factory: IComponentFactory;

  get pins() : IPin[];
  get inputPins() : IInputPin[];
  get outputPins() : IOutputPin[];

  getPinByName(pinName: ElementName) : IPin;
  getInputPinByName(pinName: ElementName) : IInputPin;
  getOutputPinByName(pinName: ElementName) : IOutputPin;

  evaluate(message: Message): EvaluationResult;
}

export { IComponent, EvaluationResult };
