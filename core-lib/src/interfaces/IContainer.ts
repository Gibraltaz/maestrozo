import { IElement, ElementName } from '@/interfaces/IElement';

interface IContainer extends IElement {
  children: readonly IElement[];
  getElementByName(elementName:ElementName): IElement;
}

export { IContainer };
