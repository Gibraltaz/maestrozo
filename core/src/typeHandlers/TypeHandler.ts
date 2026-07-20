/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MtzElement, ElementData, ElementName, ElementPath } from "@/Element";

type GetElementHelper = (elementPath: ElementPath) => Promise<MtzElement | null>;

type CreateChildElementHelper = (
  childElementName: ElementName,
  childElementType: ElementPath,
  childParams: Record<string, any>
) => Promise<MtzElement>;

type BuildHelpers = {
  getElement: GetElementHelper,
  createChildElement: CreateChildElementHelper
};

type BuildDataFunction = (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>,
  helpers: BuildHelpers
) => Promise<ElementData>;

type BuildElementFunction = (
  element: MtzElement,
  params:Record<string, any>,
  helpers: BuildHelpers
) => Promise<void>;


type TypeHandler = {
  isContainer: boolean,
  isVolatile: boolean
  buildDataFunction: BuildDataFunction,
  buildElementFunction: BuildElementFunction | null,
};

type TypeDeclaration = {
  elementName:ElementName,
  parentPath: ElementPath,
  elementType: ElementPath,
  isDerivable: boolean, // le type peut-il être dérivé en sous-type
  isContainer: boolean, // un élément de ce type peut-il contenir d'autres éléments
  isVolatile: boolean, // un élément de ce type est-il recréé à chaque fois (ou sauvegardé)
  buildDataFunction: BuildDataFunction,
  buildElementFunction: BuildElementFunction | null,
};

export {
  TypeDeclaration,
  TypeHandler,
  BuildDataFunction,
  BuildElementFunction,
  BuildHelpers
};
