/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

type ElementName = string & { __brand: 'ElementName' };
type ElementPath = Array<ElementName>;

type ElementData = Record<string, any>;

type MtzElement = {
  elementName: ElementName;
  parentPath : ElementPath;
  elementType: ElementPath;
  isContainer: boolean;
  isVolatile: boolean;
  data: ElementData | null;
  childNames: Array<ElementName> | null;
  // TODO ajouter une propriété revision pour le storage
};

export {
  MtzElement,
  ElementName,
  ElementPath,
  ElementData
}
