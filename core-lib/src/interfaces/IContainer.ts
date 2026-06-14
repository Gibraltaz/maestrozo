import { ElementName, ElementPath } from '@/global/types';
import { IElement } from '@/interfaces/IElement';

interface IContainer extends IElement {
  children: readonly IElement[];
  getElementByName(elementName: ElementName): IElement;
  findElementByPath(elementPath: ElementPath): IElement | undefined;
}

export { IContainer };
