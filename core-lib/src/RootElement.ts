import { ElementName, ElementKind } from '@/interfaces/IElement';
import { TypesRoot } from '@/TypesRoot';
import { RuntimeRoot } from '@/RuntimeRoot';
import { AbstractContainer } from './AbstractContainer';

const rootElementName: ElementName = 'root' as ElementName;
const rootElementKind: ElementKind = 'root' as ElementKind;

class RootElement extends AbstractContainer{

  readonly typesContainer :  TypesRoot;
  readonly runtimeContainer : RuntimeRoot;

  constructor() {
    super(rootElementName, rootElementKind, []);

    this.typesContainer = new TypesRoot();
    this._children[this.typesContainer.name] = this.typesContainer;

    this.runtimeContainer = new RuntimeRoot();
    this._children[this.runtimeContainer.name] = this.runtimeContainer;
  }

}

export { RootElement };
