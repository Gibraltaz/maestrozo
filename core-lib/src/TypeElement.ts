import { ElementName, ElementPath} from '@/interfaces/IElement';
import { AbstractContainer } from './AbstractContainer';
import { ElementKind } from '@/interfaces/IElement';

const TypeElementKind : ElementKind = 'type' as ElementKind;

class TypeElement extends AbstractContainer{

  constructor(elementName: ElementName, parentElementPath: ElementPath) {
    super(elementName, TypeElementKind, parentElementPath);
  }

}

export { TypeElement, TypeElementKind };
