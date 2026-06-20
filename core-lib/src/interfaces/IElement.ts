import { ElementKind, ElementName, ElementPath } from "@/global/types";

interface IElement {
  readonly name: ElementName;
  readonly kind: ElementKind;
  readonly path: ElementPath;
  get isContainer() : boolean;
}

export { IElement };
