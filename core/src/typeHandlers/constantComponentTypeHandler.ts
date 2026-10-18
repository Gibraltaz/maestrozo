/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import {
  rootName, checkElementPath, getElementPath, pathStartsWith, pathToString, rootTypeContainerName, typeElementName,
  ElementData, ElementName, ElementPath, MtzElement, TypeDeclaration, TypeHandler,
  BuildElementDataCallback, BuildElementDataFunction, BuildElementDataHelpers
} from '@maestrozo/kernel';

import { componentTypeName, outputPinTypePath } from '../global.js';
import { BuildComponentCallback, BuildComponentFunction, BuildComponentHelpers } from "./componentTypeHandler.js";

const constantComponentTypeName = 'constant' as ElementName;

const buildElementDataFunction: BuildElementDataFunction = async (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>,
  helpers: BuildElementDataHelpers
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

  const buildElementDataCallback = dataTypeHandler.callbacks.find(callback => callback.name === BuildElementDataCallback);
  if (buildElementDataCallback  === undefined)
    throw new Error(`Factory not defined in type «${pathToString(getElementPath(dataTypeElement))}»`);
  if (typeof(buildElementDataCallback.function) !== 'function')
    throw new Error(`Factory not defined in type «${pathToString(getElementPath(dataTypeElement))}»`);

  const dataFactory = buildElementDataCallback.function as BuildElementDataFunction;

  // FIXME faut-il fixer la propriété «value» au niveau du data du composant ou au niveau du data du output pin ?
  const data = await dataFactory(elementName, parentPath, params, helpers);
  if (data.value === undefined)
    throw new Error(`Data buildDataFunction of type «${pathToString(getElementPath(dataTypeElement))}» did not return a value`);

  return data;
};

const buildComponentFunction: BuildComponentFunction = async (
  element: MtzElement,
  _params:Record<string, any>,
  helpers: BuildComponentHelpers
):Promise<void> => {
  const value = element?.data?.value ?? null;

  await helpers.createChildElement(
    'out:value' as ElementName,
    outputPinTypePath,
    { value }
  );
}

const constantComponentTypeDeclaration: TypeDeclaration = {
  elementName: constantComponentTypeName,
  parentPath: [rootName, rootTypeContainerName, componentTypeName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: true, // constant contains its output pin
  isVolatile: false,
  callbacks: [
    { name: BuildElementDataCallback, function: buildElementDataFunction },
    { name: BuildComponentCallback, function: buildComponentFunction }
  ]
};

export { constantComponentTypeDeclaration, constantComponentTypeName };

