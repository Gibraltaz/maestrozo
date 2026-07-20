/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, typeElementName } from "@/global";
import { BuildDataFunction, BuildElementFunction, TypeDeclaration } from "./TypeHandler";

const buildDataFunction : BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error("Type type can not be instanciated");
};


const typeTypeDeclaration = {
  elementName: typeElementName,
  parentPath: [rootName, rootTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  childNames: null,
  isDerivable: false,
  isContainer: false,
  isVolatile: true,
  buildDataFunction: buildDataFunction,
  buildElementFunction: null
} as TypeDeclaration;

export { typeTypeDeclaration };
