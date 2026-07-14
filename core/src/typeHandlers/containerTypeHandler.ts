/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath, MtzElement } from "@/Element";
import { rootName, rootTypeContainerName, typeElementName } from '@/global';
import { FactoryFunction, TypeHandler } from '@/typeHandlers/TypeHandler';

const containerTypeName = 'container' as ElementName;

const containerFactory: FactoryFunction = (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): ElementData => {
  throw new Error("Container factory not yet implemented");
  //return {
  //} as ElementData;
};

const containerTypeHandler: TypeHandler = {
  isContainer: true,
  isVolatile: false, // FIXME un conteneur dans /types doit être volatile...
  factory: containerFactory 
} as TypeHandler;

const containerTypeElement = {
  elementName: containerTypeName,
  parentPath: [rootName, rootTypeContainerName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isContainer: true,
  isVolatile: true,
  data: {
    typeHandler: containerTypeHandler
  }
}  as MtzElement;

export { containerTypeElement, containerTypeName };

