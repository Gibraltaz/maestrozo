/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath } from "@/Element";

type FactoryFunction = (elementName: ElementName, parentPath: ElementPath, params:Record<string, any>) => ElementData;

type TypeHandler = {
  factory: FactoryFunction
};

export {
  TypeHandler,
  FactoryFunction
};
