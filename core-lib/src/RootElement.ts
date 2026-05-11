import { IContainer } from '@/interfaces/IContainer';
import { IElement, ElementName, ElementKind } from '@/interfaces/IElement';
import { RootTypeContainer } from '@/RootTypeContainer';
import { AbstractContainer } from './AbstractContainer';

const rootElementName: ElementName = 'root' as ElementName;
const rootElementKind: ElementKind = 'root' as ElementKind;

class RootElement extends AbstractContainer{

    constructor() {
      super(rootElementName, rootElementKind);
      const typeContainer = new RootTypeContainer();
      this._children[typeContainer.name] = typeContainer;
    }
}

export { RootElement };
