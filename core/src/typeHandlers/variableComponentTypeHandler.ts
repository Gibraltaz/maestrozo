/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, typeElementName, componentTypeName } from '@/global';
import { BuildDataFunction, TypeDeclaration } from '@/typeHandlers/TypeHandler';

const variableComponentTypeName = 'variable' as ElementName;


const buildDataFunction: BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error("Variable component buildDataFunction not yet implemented");
  //return {
  //} as ElementData;
};

const variableComponentTypeDeclaration: TypeDeclaration = {
  elementName: variableComponentTypeName,
  parentPath: [rootName, rootTypeContainerName, componentTypeName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  buildDataFunction: buildDataFunction,
  callbacks: []
};

export { variableComponentTypeDeclaration, variableComponentTypeName };

