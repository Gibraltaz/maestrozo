/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, dataTypeName, typeElementName } from '@/global';
import { pathToString } from "@/path";
import { FactoryFunction, TypeDeclaration, TypeHandler } from '@/typeHandlers/TypeHandler';

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
  isContainer: false,
  isVolatile: false,
  factory: stringFactory 
} as TypeHandler;

const stringTypeDeclaration = {
  elementName: stringTypeName,
  parentPath: [rootName, rootTypeContainerName, dataTypeName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isContainer: false,
  isVolatile: true,
  data: {
    typeHandler: stringTypeHandler
  }
} as TypeDeclaration;

export { stringTypeDeclaration };

