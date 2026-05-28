import { IElement, ElementName } from '@/interfaces/IElement';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { IPinContainer } from '@/interfaces/IPinContainer';

type ComponentName = ElementName & { __brand2: 'ComponentName' };
type PinName = ElementName & { __brand2: 'Pin' };
type InputPinName = PinName & { __brand3: 'InputPin' };
type OutputPinName = PinName & { __brand3: 'OutputPin' };

interface IComponent extends IElement {
  readonly factory: IComponentFactory;
  readonly inputPins : IPinContainer;
  readonly outputPins: IPinContainer;
}

export { IComponent, ComponentName, PinName, InputPinName, OutputPinName };
