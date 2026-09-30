/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { componentTypePath, rootName, rootTypeContainerName, typeElementName } from '@/global';
import { pathToString } from "@/path";
import { BuildDataFunction, TypeDeclaration } from '@/typeHandlers/TypeHandler';

const componentTypeName = 'component' as ElementName;

const buildDataFunction : BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error(`Cannot instantiate component type «${pathToString(componentTypePath)}»`);
};

const componentTypeDeclaration = {
  elementName: componentTypeName,
  parentPath: [rootName, rootTypeContainerName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: true,
  isContainer: true,
  isVolatile: true,
  buildDataFunction: buildDataFunction, 
  buildElementFunction: null
} as TypeDeclaration;

export { componentTypeDeclaration, componentTypeName };

