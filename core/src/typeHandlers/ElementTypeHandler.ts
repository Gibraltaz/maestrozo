/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { FactoryFunction, TypeHandler } from '@/typeHandlers/TypeHandler';

const elementFactory: FactoryFunction = (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): ElementData => {
  throw new Error("Element type can not be instanciate");
};

const ElementTypeHandler: TypeHandler = {
  factory: elementFactory 
} as TypeHandler;


export { ElementTypeHandler };
