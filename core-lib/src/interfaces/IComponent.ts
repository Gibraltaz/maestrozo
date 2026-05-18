import { IElement } from '@/interfaces/IElement';
import { IComponentFactory } from '@/interfaces/IComponentFactory';

interface IComponent extends IElement {
  readonly factory: IComponentFactory;
}

export { IComponent };
