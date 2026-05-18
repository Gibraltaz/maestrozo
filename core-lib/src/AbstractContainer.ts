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
    // TODO auto-test sur doublon
    if (this.getElementByName(element.name) !== null)
      throw new Error("Element is already in this container");
    this._children[element.name] = element;
  }

  getElementByName(elementName: ElementName): IElement {
    const element = this._children[elementName];
    if (element === undefined)
      throw new Error(`Element «${elementName}» not found`);
    return element;
  }
}

export { AbstractContainer };
