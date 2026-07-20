/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, typeElementName } from '@/global';
import { BuildDataFunction, BuildElementFunction, TypeDeclaration } from '@/typeHandlers/TypeHandler';

const containerTypeName = 'container' as ElementName;

const buildDataFunction : BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error("Container buildDataFunction not yet implemented");
};

const containerTypeDeclaration = {
  elementName: containerTypeName,
  parentPath: [rootName, rootTypeContainerName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: true,
  isVolatile: true,
  buildDataFunction: buildDataFunction, 
  buildElementFunction: null
} as TypeDeclaration;

export { containerTypeDeclaration, containerTypeName };

