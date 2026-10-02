/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { elementTypeName, rootName, rootTypeContainerName, typeElementName } from "@/global";
import { BuildDataFunction, CallbackName, TypeDeclaration } from "./TypeHandler";

const buildDataFunction: BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error("Element type can not be instanciate");
};

const BuildElementDataCallback = 'build-element-data' as CallbackName;

const elementTypeDeclaration: TypeDeclaration = {
  elementName: elementTypeName,
  parentPath: [rootName, rootTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: true,
  callbacks: [
    { name: BuildElementDataCallback, function: buildDataFunction }
  ]
};

export {
  elementTypeDeclaration,
  BuildElementDataCallback 
};
