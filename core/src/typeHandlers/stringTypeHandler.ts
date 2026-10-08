/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, dataTypeName, typeElementName } from '@/global';
import { pathToString } from "@/path";
import { TypeDeclaration } from '@/typeHandlers/TypeHandler';
import { BuildElementDataCallback, BuildElementDataFunction } from "./elementTypeHandler";

const stringTypeName = 'string' as ElementName;

const buildElementDataFunction : BuildElementDataFunction = async(
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>
): Promise<ElementData> => {

  const value = params.value;
  if (value === undefined)
    throw new Error(`Param «value» is not defined to create element «${pathToString([...parentPath, elementName] )}»`);
  if (typeof(value) !== 'string')
    throw new Error(`Param «value» is not a string to create element «${pathToString([...parentPath, elementName] )}»`);

  return {
    value
  } as ElementData;
};

const stringTypeDeclaration: TypeDeclaration = {
  elementName: stringTypeName,
  parentPath: [rootName, rootTypeContainerName, dataTypeName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: true,
  callbacks: [
    { name: BuildElementDataCallback, function: buildElementDataFunction }
  ]
};

export { stringTypeDeclaration };

