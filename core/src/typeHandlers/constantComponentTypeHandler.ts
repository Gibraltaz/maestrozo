/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath, MtzElement } from "@/Element";
import { rootName, rootTypeContainerName, componentTypeContainerName, typeElementName, outputPinTypePath } from '@/global';
import { checkElementPath, getElementPath, pathStartsWith, pathToString } from "@/path";
import { BuildDataFunction, BuildElementFunction, BuildHelpers, TypeDeclaration, TypeHandler } from '@/typeHandlers/TypeHandler';

const constantComponentTypeName = 'constant' as ElementName;

const buildDataFunction: BuildDataFunction = async (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>,
  helpers: BuildHelpers
): Promise<ElementData> => {

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

  const dataTypeElement = await helpers.getElement(dataTypePath);
  if (dataTypeElement === null)
    throw new Error(`Data type «${pathToString(dataTypePath)}» does not exist `
                    + `to build constant «${pathToString([...parentPath, elementName])}`);

  const dataTypeHandler: TypeHandler | null = dataTypeElement?.data?.typeHandler as TypeHandler ?? null;
  if ( dataTypeHandler === null)
    throw new Error(`Type handler not defined in type «${pathToString(getElementPath(dataTypeElement))}»`);

  const dataFactory: BuildDataFunction | null = dataTypeHandler?.buildDataFunction ?? null;
  if (dataFactory === null)
    throw new Error(`Factory not defined in type «${pathToString(getElementPath(dataTypeElement))}»`);
  if (typeof(dataFactory) !== 'function')
    throw new Error(`Factory not defined in type «${pathToString(getElementPath(dataTypeElement))}»`);

  // FIXME faut-il fixer la propriété «value» au niveau du data du composant ou au niveau du data du output pin ?
  const data = await dataFactory(elementName, parentPath, params, helpers);
  if (data.value === undefined)
    throw new Error(`Data buildDataFunction of type «${pathToString(getElementPath(dataTypeElement))}» did not return a value`);

  return data;
};

const buildElementFunction: BuildElementFunction = async (
  element: MtzElement,
  _params:Record<string, any>,
  helpers: BuildHelpers
):Promise<void> => {
  const value = element?.data?.value ?? null;

  await helpers.createChildElement(
    'out:value' as ElementName,
    outputPinTypePath,
    { value }
  );
}

const constantComponentTypeDeclaration = {
  elementName: constantComponentTypeName,
  parentPath: [rootName, rootTypeContainerName, componentTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: true, // constant contains its output pin
  isVolatile: false,
  buildDataFunction: buildDataFunction,
  buildElementFunction: buildElementFunction
} as TypeDeclaration;

export { constantComponentTypeDeclaration, constantComponentTypeName };

