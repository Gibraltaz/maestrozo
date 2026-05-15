import { IContainer } from '@/interfaces/IContainer';
import { IElement, ElementName, ElementKind } from '@/interfaces/IElement';
import { TypesRoot } from '@/TypesRoot';
import { AbstractContainer } from './AbstractContainer';

const rootElementName: ElementName = 'root' as ElementName;
const rootElementKind: ElementKind = 'root' as ElementKind;

class RootElement extends AbstractContainer{

    constructor() {
      super(rootElementName, rootElementKind, []);
      const typesContainer = new TypesRoot();
      this._children[typesContainer.name] = typesContainer;
    }
}

export { RootElement };
