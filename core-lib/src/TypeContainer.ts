import { ITypeContainer } from '@/interfaces/ITypeContainer';
import { AbstractContainer } from '@/AbstractContainer';

import { DataTypeElement } from '@/DataTypeElement';
import { IDataFactory } from '@/interfaces/IDataFactory';

import { ComponentTypeElement } from '@/ComponentTypeElement';
import { IComponentFactory } from '@/interfaces/IComponentFactory';

import { PinTypeElement } from '@/Pin';
import { IPinFactory } from '@/interfaces/IPin';

import { PinConnectionTypeElement } from '@/PinConnection';
import { IPinConnectionFactory } from '@/interfaces/IPinConnection';
import { typeElementKind } from './global/kinds';
import { ElementName, ElementPath } from './global/types';

class TypeContainer extends AbstractContainer implements ITypeContainer {
  readonly kind = typeElementKind;

  constructor(elementName: ElementName, parentElementPath: ElementPath ) {
    super(elementName, typeElementKind, parentElementPath);
  }

  declareDataType(dataFactory : IDataFactory) : DataTypeElement {
    const typeElement = new DataTypeElement(dataFactory, this.path);
    this.addChild(typeElement);
    return typeElement;
  }

  declarePinType(pinFactory : IPinFactory) : PinTypeElement {
    const typeElement = new PinTypeElement(pinFactory, this.path);
    this.addChild(typeElement);
    return typeElement;
  }

  declareComponentType(componentFactory : IComponentFactory) : ComponentTypeElement {
    const typeElement = new ComponentTypeElement(componentFactory, this.path);
    this.addChild(typeElement);
    return typeElement;
  }

  declarePinConnectionType(pinConnectionFactory : IPinConnectionFactory) : PinConnectionTypeElement {
    let typeElement = new PinConnectionTypeElement(pinConnectionFactory, this.path);
    this.addChild(typeElement);
    return typeElement;
  }

}

export { TypeContainer };
