import { IContainer } from '@/interfaces/IContainer';
import { IElement } from '@/interfaces/IElement';
import { ElementKind, ElementName, ElementPath } from './global/types';


abstract class AbstractContainer implements IContainer {
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

  get isContainer(): boolean {
    return true;
  }

  get children() : readonly IElement[] {
    return Object.values(this._children);
  }

  protected addChild(element: IElement) {
    if (! element.name)
      throw new Error(`Name of element to add is not defined in the container «${this.name}»`);
    if (this._children[element.name] !== undefined)
      throw new Error(`Element «${element.name}» is already in the container «${this.name}»`);
    this._children[element.name] = element;
  }

  getElementByName(elementName: ElementName): IElement {
    const element = this._children[elementName];
    if (element === undefined)
      throw new Error(`Element «${elementName}» not found in container «${this.name}»`);
    return element;
  }

  findElementByPath(elementPath: ElementPath): IElement | undefined {
    const [ elementName, ...elementPathRest ] = [... elementPath ];
    const element = this._children[elementName];
    if (element === undefined)
      throw new Error(`Element «${elementName}» not found in container «${this.name}»`);
    if (elementPathRest.length === 0 )
      return element;
    if (! element.isContainer )
      throw new Error(`Element «${elementName}» in container «${this.name}» is not a container`);
    
    const container: IContainer = element as IContainer;
    return container.findElementByPath(elementPathRest);
  }
}

export { AbstractContainer };
