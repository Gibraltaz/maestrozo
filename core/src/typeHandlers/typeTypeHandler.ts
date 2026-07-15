/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, typeElementName } from "@/global";
import { FactoryFunction } from "./TypeHandler";

const typeFactory: FactoryFunction = (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): ElementData => {
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
  factory: typeFactory 
};

export { typeTypeDeclaration };
