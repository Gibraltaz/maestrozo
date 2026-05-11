type ElementName = string & { __brand: 'ElementName' };
type ElementKind = string & { __brand: 'ElementKind' };
const LeafElementKind: ElementKind = 'leaf' as ElementKind;

interface IElement {
    readonly name: ElementName;
    readonly kind: ElementKind;
}

export { IElement, ElementKind, ElementName, LeafElementKind };
