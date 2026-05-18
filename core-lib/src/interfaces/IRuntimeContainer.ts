import { IElement } from '@/interfaces/IElement';
import { IContainer } from '@/interfaces/IContainer';

interface IRuntimeContainer extends IContainer {
  addComponent(element : IElement) : void;
};

export { IRuntimeContainer };
