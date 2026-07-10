/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, componentTypeContainerName, typeElementName } from '@/global';
import { FactoryFunction, TypeHandler } from '@/typeHandlers/TypeHandler';

const constantComponentTypeName = 'constant' as ElementName;


const constantComponentFactory: FactoryFunction = (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): ElementData => {
  return {
  } as ElementData;
};

const constantComponentTypeHandler: TypeHandler = {
  factory: constantComponentFactory 
} as TypeHandler;

const constantComponentTypeElement = {
  elementName: constantComponentTypeName,
  parentPath: [rootName, rootTypeContainerName, componentTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  data: {
    typeHandler: constantComponentTypeHandler
  }
}; // TODO  as Element;

export { constantComponentTypeElement, constantComponentTypeName };

