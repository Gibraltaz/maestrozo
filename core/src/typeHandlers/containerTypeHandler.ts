/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
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
  factory: containerFactory 
} as TypeHandler;

const containerTypeElement = {
  elementName: containerTypeName,
  parentPath: [rootName, rootTypeContainerName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  data: {
    typeHandler: containerTypeHandler
  }
}; // TODO  as Element;

export { containerTypeElement, containerTypeName };

