import { IElement, ElementName  } from '@/interfaces/IElement';

interface IPin extends IElement {
}

interface IPinFactory {
  readonly name : ElementName;
};

export { IPin, IPinFactory };
