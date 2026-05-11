import { IContainer } from '@/interfaces/IContainer';
import { IElement, ElementName, LeafElementKind } from '@/interfaces/IElement';
import { AbstractContainer } from './AbstractContainer';
import { ElementKind } from '@/interfaces/IElement';

const TypeElementKind : ElementKind = 'type' as ElementKind;

class TypeElement extends AbstractContainer{

  constructor(elementName: ElementName) {
    super(elementName, TypeElementKind);
  }

}

export { TypeElement, TypeElementKind };
