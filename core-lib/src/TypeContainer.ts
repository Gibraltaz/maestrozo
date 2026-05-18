import { ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { ITypeContainer } from '@/interfaces/ITypeContainer';
import { AbstractContainer } from '@/AbstractContainer';

import { DataTypeElement } from '@/DataTypeElement';
import { IDataFactory } from '@/interfaces/IDataFactory';

import { ComponentTypeElement } from '@/ComponentTypeElement';
import { IComponentFactory } from '@/interfaces/IComponentFactory';

import { PinTypeElement } from '@/Pin';
import { IPinFactory } from '@/interfaces/IPin';

const typeElementKind : ElementKind = 'type-container' as ElementKind;

class TypeContainer extends AbstractContainer implements ITypeContainer {
  readonly kind = typeElementKind;

  constructor(elementName: ElementName, parentElementPath: ElementPath ) {
    super(elementName, typeElementKind, parentElementPath);
  }

  declareDataType(dataFactory : IDataFactory) : void {
    let typeElement = new DataTypeElement(dataFactory, this.path);
    this.addChild(typeElement);
  }

  declarePinType(pinFactory : IPinFactory) : void {
    let typeElement = new PinTypeElement(pinFactory, this.path);
    this.addChild(typeElement);
  }

  declareComponentType(componentFactory : IComponentFactory) : void {
    let typeElement = new ComponentTypeElement(componentFactory, this.path);
    this.addChild(typeElement);
  }

}

export { TypeContainer, typeElementKind };
