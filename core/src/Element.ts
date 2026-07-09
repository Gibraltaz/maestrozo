/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

type ElementName = string & { __brand: 'ElementName' };
type ElementPath = Array<ElementName>;

type Element = {
  elementName: ElementName;
  parentPath : ElementPath;
  elementType: ElementPath;
};

export { Element, ElementName, ElementPath }
