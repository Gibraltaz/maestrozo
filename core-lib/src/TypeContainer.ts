import { IContainer } from '@/interfaces/IContainer';
import { IElement, ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { TypeElement } from '@/TypeElement';
import { AbstractContainer } from '@/AbstractContainer';

const typeElementKind : ElementKind = 'type-container' as ElementKind;

class TypeContainer extends AbstractContainer {
    readonly kind = typeElementKind;

    constructor(elementName: ElementName, parentElementPath: ElementPath ) {
        super(elementName, typeElementKind, parentElementPath);
    }

    declareDataType(typeName: ElementName) {
        let typeElement = new TypeElement(typeName, this.path);
        this.addChild(typeElement);
    }
}

export { TypeContainer, typeElementKind };
