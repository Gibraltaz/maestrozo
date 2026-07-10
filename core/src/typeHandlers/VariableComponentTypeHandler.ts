/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, elementTypeName, containerTypeName, componentTypeContainerName } from '@/global';
import { FactoryFunction, TypeHandler } from '@/typeHandlers/TypeHandler';

const variableComponentTypeName = 'variable' as ElementName;


const variableComponentFactory: FactoryFunction = (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): ElementData => {
  throw new Error("Variable component factory not yet implemented");
  //return {
  //} as ElementData;
};

const variableComponentTypeHandler: TypeHandler = {
  factory: variableComponentFactory 
} as TypeHandler;

const variableComponentTypeElement = {
  elementName: variableComponentTypeName,
  parentPath: [rootName, rootTypeContainerName, componentTypeContainerName] as ElementPath,
  elementType: [rootName, elementTypeName, containerTypeName] as ElementPath,
  data: {
    typeHandler: variableComponentTypeHandler
  }
}; // TODO  as Element;

export { variableComponentTypeElement, variableComponentTypeName };

