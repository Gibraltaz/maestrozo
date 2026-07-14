/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MtzElement, ElementData, ElementName, ElementPath } from "@/Element";

type GetElementFactoryHelper = (elementPath: ElementPath) => MtzElement | null;

type FactoryHelpers = {
  getElement: GetElementFactoryHelper
};

type FactoryFunction = (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>,
  helpers: FactoryHelpers

) => ElementData;

type TypeHandler = {
  factory: FactoryFunction,
  isContainer: boolean,
  isVolatile: boolean
};

export {
  TypeHandler,
  FactoryFunction,
  FactoryHelpers
};
