import { IElement } from '@/interfaces/IElement';
import { ITypeFactory } from '@/interfaces/ITypeFactory';

interface ITypeElement extends IElement {
  readonly factory: ITypeFactory;
}

export { ITypeElement };
