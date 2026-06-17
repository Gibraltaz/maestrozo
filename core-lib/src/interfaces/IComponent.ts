import { IElement } from '@/interfaces/IElement';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { ElementName, EvaluationResult } from '@/global/types';
import { Message } from '@/global/messages';
import { IPin } from './IPin';

interface IComponent extends IElement {
  readonly factory: IComponentFactory;

  get pins() : IPin[];
  get inputPins() : IPin[];
  get outputPins() : IPin[];

  getPinByName(pinName: ElementName) : IPin;
  getInputPinByName(pinName: ElementName) : IPin;
  getOutputPinByName(pinName: ElementName) : IPin;

  evaluate(message: Message): EvaluationResult;
}

export { IComponent, EvaluationResult };
