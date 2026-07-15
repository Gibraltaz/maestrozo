/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, typeElementName, componentTypeContainerName } from '@/global';
import { FactoryFunction, TypeDeclaration } from '@/typeHandlers/TypeHandler';

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

const variableComponentTypeDeclaration = {
  elementName: variableComponentTypeName,
  parentPath: [rootName, rootTypeContainerName, componentTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  factory: variableComponentFactory
} as TypeDeclaration;

export { variableComponentTypeDeclaration, variableComponentTypeName };

