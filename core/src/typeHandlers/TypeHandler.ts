/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MtzElement, ElementData, ElementName, ElementPath } from "@/Element";

type GetElementFactoryHelper = (elementPath: ElementPath) => Promise<MtzElement | null>;

type FactoryHelpers = {
  getElement: GetElementFactoryHelper
};

type FactoryFunction = (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>,
  helpers: FactoryHelpers
) => Promise<ElementData>;

type TypeHandler = {
  isContainer: boolean,
  isVolatile: boolean
  factory: FactoryFunction,
};

type TypeDeclaration = {
  elementName:ElementName,
  parentPath: ElementPath,
  elementType: ElementPath,
  isDerivable: boolean, // le type peut-il être dérivé en sous-type
  isContainer: boolean, // un élément de ce type peut-il en contenir d'autres
  isVolatile: boolean, // est-il sauvegardé ou recréé à chaque fois
  factory: FactoryFunction,
};

export {
  TypeDeclaration,
  TypeHandler,
  FactoryFunction,
  FactoryHelpers
};
