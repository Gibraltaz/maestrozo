/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementPath } from "@/Element";
import { elementTypeName, rootName, rootTypeContainerName, typeElementName } from "@/global";
import { ElementTypeHandler } from "./ElementTypeHandler";

// element «#/types/element»
const elementTypeElement = {
  elementName: elementTypeName,
  parentPath: [rootName, rootTypeContainerName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isContainer: false,
  data: {
    typeHandler: ElementTypeHandler
  }
};

export {elementTypeElement};
