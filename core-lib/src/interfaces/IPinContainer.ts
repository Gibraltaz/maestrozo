import { IContainer } from '@/interfaces/IContainer';
import { IPin } from '@/interfaces/IPin';
import { ElementName } from '@/interfaces/IElement';

interface IPinContainer extends IContainer {
  getPinByName(pinName: ElementName) : IPin;
  get pins() : IPin[];
};

export { IPinContainer };
