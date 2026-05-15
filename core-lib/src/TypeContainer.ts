import { IContainer } from '@/interfaces/IContainer';
import { TypeElement } from '@/TypeElement';
import { IElement, ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { ITypeContainer } from '@/interfaces/ITypeContainer';
import { AbstractContainer } from '@/AbstractContainer';
import { ITypeFactory } from '@/interfaces/ITypeFactory';

const typeElementKind : ElementKind = 'type-container' as ElementKind;

class TypeContainer extends AbstractContainer implements ITypeContainer {
  readonly kind = typeElementKind;

  constructor(elementName: ElementName, parentElementPath: ElementPath ) {
    super(elementName, typeElementKind, parentElementPath);
  }

  declareDataType(typeFactory : ITypeFactory) : void {
    let typeElement = new TypeElement(typeFactory, this.path);
    //typeFactory.declare(this);
    this.addChild(typeElement);
  }

}

export { TypeContainer, typeElementKind };
