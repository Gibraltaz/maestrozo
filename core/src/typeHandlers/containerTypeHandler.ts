/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";
import { rootName, rootTypeContainerName, typeElementName } from '@/global';
import { TypeDeclaration } from '@/typeHandlers/TypeHandler';
import { BuildElementDataCallback, BuildElementDataFunction } from "./elementTypeHandler";

const containerTypeName = 'container' as ElementName;

const buildElementDataFunction : BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error("Container buildDataFunction not yet implemented");
};

const containerTypeDeclaration: TypeDeclaration = {
  elementName: containerTypeName,
  parentPath: [rootName, rootTypeContainerName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: true,
  isVolatile: true,
  callbacks: [
    { name: BuildElementDataCallback, function: buildElementDataFunction }
  ]
};

export { containerTypeDeclaration, containerTypeName };

