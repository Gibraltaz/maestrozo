import { IContainer } from '@/interfaces/IContainer';
import { IElement, ElementName, ElementKind } from '@/interfaces/IElement';
import { TypeElement } from '@/TypeElement';
import { AbstractContainer } from '@/AbstractContainer';

const typeElementKind : ElementKind = 'type-container' as ElementKind;

class TypeContainer extends AbstractContainer {
    readonly kind = typeElementKind;

    constructor(elementName: ElementName) {
        super(elementName, typeElementKind);
    }

    declareDataType(typeName: ElementName) {
        let typeElement = new TypeElement(typeName);
        this.addChild(typeElement);
    }
}

export { TypeContainer, typeElementKind };
