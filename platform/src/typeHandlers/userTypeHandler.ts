/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import {
  ElementData, ElementName, ElementPath, TypeDeclaration, 
  rootName, pathToString, rootTypeContainerName, typeElementName,
  BuildElementDataCallback, BuildElementDataFunction
} from '@maestrozo/kernel';


import { userTypeName, userTypePath } from '../global.js';

const buildElementDataFunction : BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error(`Cannot instantiate user type «${pathToString(userTypePath)}»`);
};

const userTypeDeclaration: TypeDeclaration = {
  elementName: userTypeName,
  parentPath: [rootName, rootTypeContainerName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: true,
  callbacks: [
    { name: BuildElementDataCallback, function: buildElementDataFunction }
  ]
};

export {
  userTypeDeclaration
};
