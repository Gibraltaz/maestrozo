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

const elementPropertyNames : Array<string> = [
    'elementName',
    'parentPath',
    'elementType',
    'isContainer',
    'isVolatile',
    'childNames',
    'data'
];

const checkElement = (element: MtzElement) => {
  const missingProperties: Array<string> = [];
  for (const propertyName of elementPropertyNames) {
    //@ts-ignore
    if (element[propertyName] === undefined)
      missingProperties.push(propertyName);
  }
  if (missingProperties.length > 0)
    throw new Error("Missing element properties : " + missingProperties.join(','));
}

export {
  MtzElement,
  ElementName,
  ElementPath,
  ElementData,
  checkElement
}
