import { IContainer } from '@/interfaces/IContainer';
import { IElement, ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';

class AbstractContainer implements IContainer{
  name: ElementName;
  kind: ElementKind;
  path: ElementPath;

  protected _children : Record<ElementName, IElement> = {};

  constructor(elementName: ElementName, elementKind: ElementKind, parentElementPath: ElementPath) {
    this.name = elementName;
    this.kind = elementKind;
    if (parentElementPath === undefined)
      throw new Error("Parent element path not defined");
    this.path = [ ...parentElementPath, elementName ];
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
