/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, componentTypeContainerName, typeElementName } from '@/global';
import { checkElementPath, getElementPath, pathStartsWith, pathToString } from "@/path";
import { FactoryFunction, FactoryHelpers, TypeHandler } from '@/typeHandlers/TypeHandler';

const constantComponentTypeName = 'constant' as ElementName;

const constantComponentFactory: FactoryFunction = (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>,
  helpers: FactoryHelpers
): ElementData => {

  const dataTypePath = params?.dataType ?? null;

  // type de données lié au composant Constant
  try {
    checkElementPath(dataTypePath);
    if (! pathStartsWith(dataTypePath, dataTypePath))
        throw new Error(`Type «${pathToString(dataTypePath)} is not a data type»`);
  }
  catch (error: any) {
    throw new Error(`Invalid «dataType» param to build constant «${pathToString([...parentPath, elementName])} : ${error.message}`);
  }

  const dataTypeElement = helpers.getElement(dataTypePath);
  if (dataTypeElement === null)
    throw new Error(`Data type «${pathToString(dataTypePath)}» does not exist `
                    + `to build constant «${pathToString([...parentPath, elementName])}`);

  const dataTypeHandler: TypeHandler | null = dataTypeElement?.data?.typeHandler as TypeHandler ?? null;
  if ( dataTypeHandler === null)
    throw new Error(`Type handler not defined in type «${pathToString(getElementPath(dataTypeElement))}»`);

  const dataFactory: FactoryFunction | null = dataTypeHandler?.factory ?? null;
  if (dataFactory === null)
    throw new Error(`Factory not defined in type «${pathToString(getElementPath(dataTypeElement))}»`);
  if (typeof(dataFactory) !== 'function')
    throw new Error(`Factory not defined in type «${pathToString(getElementPath(dataTypeElement))}»`);

  const data = dataFactory(elementName, parentPath, params, helpers);
  if (data.value === undefined)
    throw new Error(`Data factory of type «${pathToString(getElementPath(dataTypeElement))}» did not return a value`);

  return data;
};

const constantComponentTypeHandler: TypeHandler = {
  factory: constantComponentFactory
} as TypeHandler;

const constantComponentTypeElement = {
  elementName: constantComponentTypeName,
  parentPath: [rootName, rootTypeContainerName, componentTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  data: {
    typeHandler: constantComponentTypeHandler
  }
}; // TODO  as Element;

export { constantComponentTypeElement, constantComponentTypeName };

