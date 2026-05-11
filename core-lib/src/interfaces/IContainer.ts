import { IElement, ElementName, ElementKind } from '@/interfaces/IElement';

interface IContainer extends IElement {
  children: readonly IElement[];
  getElementByName(elementName:ElementName): IElement | null;
}

export { IContainer };
