/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

type ElementName = string & { __brand: 'ElementName' };
type ElementPath = Array<ElementName>;

type ElementData = Record<string, any>;

type MtzElement = {
  revision: number;
  elementName: ElementName;
  parentPath : ElementPath;
  elementType: ElementPath;
  isContainer: boolean;
  isVolatile: boolean;
  data: ElementData | null;
  childNames: Array<ElementName> | null; // FIXME devrait être dans un type MtzContainer
};

const elementPropertyNames : Array<string> = [
  'revision',
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
