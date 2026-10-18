/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import {
  rootName, ElementData, ElementName, ElementPath, rootTypeContainerName, typeElementName,
  TypeDeclaration, BuildElementDataCallback, BuildElementDataFunction
} from '@maestrozo/kernel';

import { componentTypeName } from '../global.js';

const variableComponentTypeName = 'variable' as ElementName;


const buildElementDataFunction: BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error("Variable component buildDataFunction not yet implemented");
};

const variableComponentTypeDeclaration: TypeDeclaration = {
  elementName: variableComponentTypeName,
  parentPath: [rootName, rootTypeContainerName, componentTypeName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  callbacks: [
    { name: BuildElementDataCallback, function: buildElementDataFunction }
  ]
};

export { variableComponentTypeDeclaration, variableComponentTypeName };

