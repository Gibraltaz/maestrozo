import { ElementName } from '@/global/types';
import { IContainer } from '@/interfaces/IContainer';
import { IPin } from '@/interfaces/IPin';

interface IPinContainer extends IContainer {
  getPinByName(pinName: ElementName) : IPin;
  get pins() : IPin[];
};

export { IPinContainer };
