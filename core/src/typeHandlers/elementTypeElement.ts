/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { elementTypeName, rootName, rootTypeContainerName, typeElementName } from "@/global";
import { FactoryFunction, TypeHandler } from "./TypeHandler";

const elementFactory: FactoryFunction = (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): ElementData => {
  throw new Error("Element type can not be instanciate");
};


const elementTypeHandler: TypeHandler = {
  isContainer: false,
  factory: elementFactory 
} as TypeHandler;


// element «#/types/element»
const elementTypeElement = {
  elementName: elementTypeName,
  parentPath: [rootName, rootTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isContainer: false,
  data: {
    typeHandler: elementTypeHandler
  }
};

export {elementTypeElement};
