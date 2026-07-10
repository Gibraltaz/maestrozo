/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, dataTypeName, typeElementName } from '@/global';
import { pathToString } from "@/path";
import { FactoryFunction, TypeHandler } from '@/typeHandlers/TypeHandler';

const booleanTypeName = 'boolean' as ElementName;

const booleanFactory: FactoryFunction = (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>
): ElementData => {

  const value = params.value;
  if (value === undefined)
    throw new Error(`Param «value» is not defined to create element «${pathToString([...parentPath, elementName] )}»`);
  if (typeof(value) !== 'boolean')
    throw new Error(`Param «value» is not a boolean to create element «${pathToString([...parentPath, elementName] )}»`);

  return {
    value
  } as ElementData;

};

const booleanTypeHandler: TypeHandler = {
  factory: booleanFactory 
} as TypeHandler;

const booleanTypeElement = {
  elementName: booleanTypeName,
  parentPath: [rootName, rootTypeContainerName, dataTypeName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  data: {
    typeHandler: booleanTypeHandler
  }
};

export { booleanTypeElement };

