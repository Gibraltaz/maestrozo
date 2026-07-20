/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath, MtzElement } from "@/Element";
import { rootName, rootTypeContainerName, typeElementName, componentTypeContainerName } from '@/global';
import { BuildDataFunction, BuildElementFunction, BuildHelpers, TypeDeclaration } from '@/typeHandlers/TypeHandler';

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

const buildElementFunction = async (
  _element: MtzElement,
  _params:Record<string, any>,
  _helpers: BuildHelpers
):Promise<void> => {
}

const variableComponentTypeDeclaration = {
  elementName: variableComponentTypeName,
  parentPath: [rootName, rootTypeContainerName, componentTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  buildDataFunction: buildDataFunction,
  buildElementFunction: buildElementFunction
} as TypeDeclaration;

export { variableComponentTypeDeclaration, variableComponentTypeName };

