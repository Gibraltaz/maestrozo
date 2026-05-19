import { IElement } from '@/interfaces/IElement';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { IPinContainer } from '@/interfaces/IPinContainer';

interface IComponent extends IElement {
  readonly factory: IComponentFactory;
  readonly inputPins : IPinContainer;
  readonly outputPins: IPinContainer;
}

export { IComponent };
