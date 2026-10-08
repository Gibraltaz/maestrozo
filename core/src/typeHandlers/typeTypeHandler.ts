/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, typeElementName } from "@/global";
import { TypeDeclaration } from "./TypeHandler";
import { BuildElementDataCallback, BuildElementDataFunction } from "./elementTypeHandler";

const buildElementDataFunction : BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error("Type type can not be instanciated");
};


const typeTypeDeclaration: TypeDeclaration = {
  elementName: typeElementName,
  parentPath: [rootName, rootTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: true,
  callbacks: [
    { name: BuildElementDataCallback, function: buildElementDataFunction }
  ]
};

export { typeTypeDeclaration };
