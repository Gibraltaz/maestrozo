/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, dataTypeName, typeElementName } from '@/global';
import { pathToString } from "@/path";
import { TypeDeclaration } from '@/typeHandlers/TypeHandler';
import { BuildElementDataCallback, BuildElementDataFunction } from "./elementTypeHandler";

const booleanTypeName = 'boolean' as ElementName;

const buildElementDataFunction: BuildElementDataFunction = async (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>
): Promise<ElementData> => {

  const value = params.value;
  if (value === undefined)
    throw new Error(`Param «value» is not defined to create element «${pathToString([...parentPath, elementName] )}»`);
  if (typeof(value) !== 'boolean')
    throw new Error(`Param «value» is not a boolean to create element «${pathToString([...parentPath, elementName] )}»`);

  return {
    value
  } as ElementData;

};


const booleanTypeDeclaration: TypeDeclaration = {
  elementName: booleanTypeName,
  parentPath: [rootName, rootTypeContainerName, dataTypeName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  callbacks: [
    { name: BuildElementDataCallback, function: buildElementDataFunction }
  ]
};

export { booleanTypeDeclaration };

