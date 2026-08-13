/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath, MtzElement } from "@/Element";
import { linkTypeContainerPath, rootName, rootTypeContainerName, typeElementName } from '@/global';
import { BuildDataFunction, BuildHelpers, TypeDeclaration } from '@/typeHandlers/TypeHandler';
import { rootTypeContainerPath, linkTypeContainerName } from '@/global';


// name of element «#/types/links/connection»
const connectionTypeName = 'connection' as ElementName;
const connectionTypePath = [...rootTypeContainerPath, linkTypeContainerName, connectionTypeName];

const buildDataFunction: BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  params:Record<string, any>
): Promise<ElementData> => {
  
  const sourceComponent = params['sourceComponent'];
  if (sourceComponent === undefined)
    throw new Error(`Param «sourceComponent" not defined`);

  const sourcePin = params['sourcePin'];
  if (sourcePin === undefined)
    throw new Error(`Param «pinComponent" not defined`);

  const targetComponent  = params['targetComponent'];
  if (targetComponent === undefined)
    throw new Error(`Param «targetComponent" not defined`);

  const targetPin = params['targetPin'];
  if (targetPin === undefined)
    throw new Error(`Param «targetComponent" not defined`);

  return {
    sourceComponent,
    sourcePin,
    targetComponent,
    targetPin
  } as ElementData;
};

const buildElementFunction = async (
  _element: MtzElement,
  _params:Record<string, any>,
  _helpers: BuildHelpers
):Promise<void> => {
}

const connectionTypeDeclaration = {
  elementName: connectionTypeName,
  parentPath: linkTypeContainerPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  buildDataFunction: buildDataFunction,
  buildElementFunction: buildElementFunction
} as TypeDeclaration;

export { connectionTypeDeclaration, connectionTypeName, connectionTypePath };

