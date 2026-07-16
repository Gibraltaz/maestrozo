/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, dataTypeName, typeElementName } from '@/global';
import { pathToString } from "@/path";
import { FactoryFunction, TypeDeclaration } from '@/typeHandlers/TypeHandler';

const integerTypeName = 'integer' as ElementName;

const integerFactory: FactoryFunction = (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>
): ElementData => {

  const value = params.value;
  if (value === undefined)
    throw new Error(`Param «value» is not defined to create element «${pathToString([...parentPath, elementName] )}»`);
  if (typeof(value) !== 'number')
    throw new Error(`Param «value» is not a number to create element «${pathToString([...parentPath, elementName] )}»`);

  return {
    value
  } as ElementData;
};

const integerTypeDeclaration = {
  elementName: integerTypeName,
  parentPath: [rootName, rootTypeContainerName, dataTypeName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: true,
  factory: integerFactory
} as TypeDeclaration;

export { integerTypeDeclaration };
