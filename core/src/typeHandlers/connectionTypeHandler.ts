/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import {
  rootName, ElementData, ElementName, ElementPath, rootTypeContainerName, rootTypeContainerPath, typeElementName,
  TypeDeclaration, BuildElementDataCallback, BuildElementDataFunction 
} from 'maestrozo-kernel';

import { linkTypeContainerPath, linkTypeContainerName } from '../global.js';


// name of element «#/types/links/connection»
const connectionTypeName = 'connection' as ElementName;
const connectionTypePath = [...rootTypeContainerPath, linkTypeContainerName, connectionTypeName];

const buildElementDataFunction: BuildElementDataFunction = async (
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

const connectionTypeDeclaration: TypeDeclaration = {
  elementName: connectionTypeName,
  parentPath: linkTypeContainerPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  callbacks: [
    { name: BuildElementDataCallback, function: buildElementDataFunction }
  ]
};

export { connectionTypeDeclaration, connectionTypeName, connectionTypePath };

