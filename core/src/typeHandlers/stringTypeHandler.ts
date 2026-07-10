/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, dataTypeName, elementTypeName, containerTypeName } from '@/global';
import { pathToString } from "@/path";
import { FactoryFunction, TypeHandler } from '@/typeHandlers/TypeHandler';

const stringTypeName = 'string' as ElementName;

const stringFactory: FactoryFunction = (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>
): ElementData => {

  const value = params.value;
  if (value === undefined)
    throw new Error(`Param «value» is not defined to create element «${pathToString([...parentPath, elementName] )}»`);
  if (typeof(value) !== 'string')
    throw new Error(`Param «value» is not a string to create element «${pathToString([...parentPath, elementName] )}»`);

  return {
    value
  } as ElementData;
};

const stringTypeHandler: TypeHandler = {
  factory: stringFactory 
} as TypeHandler;

const stringTypeElement = {
  elementName: stringTypeName,
  parentPath: [rootName, rootTypeContainerName, dataTypeName ] as ElementPath,
  elementType: [rootName, elementTypeName, containerTypeName] as ElementPath,
  data: {
    typeHandler: stringTypeHandler
  }
};

export { stringTypeElement };

