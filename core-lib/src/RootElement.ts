import { IElement } from '@/interfaces/IElement';
import { TypesRoot } from '@/TypesRoot';
import { RuntimeRoot } from '@/RuntimeRoot';
import { AbstractContainer } from './AbstractContainer';
import { ElementKind, ElementName, ElementPath } from './global/types';

const rootElementName: ElementName = 'root' as ElementName;
const rootElementKind: ElementKind = 'root' as ElementKind;

class RootElement extends AbstractContainer {

  readonly typesContainer :  TypesRoot;
  readonly runtimeContainer : RuntimeRoot;

  constructor() {
    super(rootElementName, rootElementKind, []);

    this.typesContainer = new TypesRoot();
    this._children[this.typesContainer.name] = this.typesContainer;

    this.runtimeContainer = new RuntimeRoot();
    this._children[this.runtimeContainer.name] = this.runtimeContainer;
  }

  findElementByPath(elementPath: ElementPath): IElement | undefined {
    const [ baseElementName, ...restElementPath ] = [... elementPath];
    if (baseElementName === this.typesContainer.name)
      if (restElementPath.length === 0)
        return this.typesContainer.getElementByName(restElementPath[0]);
      else
        return this.typesContainer.findElementByPath(restElementPath);
    if (baseElementName === this.runtimeContainer.name) {
      if (restElementPath.length === 0)
        return this.runtimeContainer;
      else
        return this.runtimeContainer.findElementByPath(restElementPath);
    }
    throw new Error(`Invalid base element name «${baseElementName}»`);
  }
}

export { RootElement };
