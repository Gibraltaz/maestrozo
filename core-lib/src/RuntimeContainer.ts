import { IElement, ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { AbstractContainer } from '@/AbstractContainer';
import { IRuntimeContainer } from '@/interfaces/IRuntimeContainer';
import { elementPathAreEquals, parentElementPath } from '@/utils/path';

const runtimeElementKind : ElementKind = 'runtime-container' as ElementKind;

class RuntimeContainer extends AbstractContainer implements IRuntimeContainer {
  readonly kind = runtimeElementKind;

  constructor(elementName: ElementName, parentElementPath: ElementPath ) {
    super(elementName, runtimeElementKind, parentElementPath);
  }

  addComponent(element : IElement) : void {
    if (! elementPathAreEquals(this.path, parentElementPath(element.path)))
      throw new Error("Wrong element path");
    this.addChild(element);
  }

}

export { RuntimeContainer, runtimeElementKind };
