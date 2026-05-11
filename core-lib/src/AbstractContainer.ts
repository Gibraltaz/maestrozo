import { IContainer } from '@/interfaces/IContainer';
import { IElement, ElementName, ElementKind } from '@/interfaces/IElement';

class AbstractContainer implements IContainer{
  name: ElementName;
  kind: ElementKind;

  protected _children : Record<ElementName, IElement> = {};

  constructor(elementName: ElementName, elementKind: ElementKind) {
    this.name = elementName;
    this.kind = elementKind;
    this._children = {};
  }

  get children() : readonly IElement[] {
    return Object.values(this._children);
  }

  protected addChild(element: IElement) {
    this._children[element.name] = element;
  }

  getElementByName(elementName: ElementName): IElement | null {
    return this._children[elementName] ?? null;
  }

}

export { AbstractContainer };
