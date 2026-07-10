/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, elementTypeName, typeElementName } from '@/global';
import { FactoryFunction, TypeHandler } from '@/typeHandlers/TypeHandler';

const elementFactory: FactoryFunction = (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): ElementData => {
  throw new Error("Element type can not be instanciate");
};

const elementTypeHandler: TypeHandler = {
  factory: elementFactory 
} as TypeHandler;

const elementTypeElement = {
  elementName: elementTypeName,
  parentPath: [rootName, rootTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  data: {
    typeHandler: elementTypeHandler
  }
}; // TODO  as Element;

export { elementTypeElement, elementTypeName };

