type ElementName = string & { __brand: 'ElementName' };
type ElementKind = string & { __brand: 'ElementKind' };
type ElementPath = Array<ElementName>;

interface IElement {
    readonly name: ElementName;
    readonly kind: ElementKind;
    readonly path: ElementPath;
}

export { IElement, ElementKind, ElementName, ElementPath };
