/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { Element, ElementName, ElementPath } from '@/Element';

const pathSeparator = '/';

const invalidCharacters = [ pathSeparator ];


function elementPath(element: Element) {
  return [...element.parentPath, element.elementName];
}

function elementPathAreEquals ( pathA: ElementPath, pathB: ElementPath ) : boolean {
  if (pathA.length != pathB.length)
    return false;
  for (let i = 0; i < pathA.length; i++) {
    if (pathA[i] !== pathB[i])
      return false;
  }
  return true;
}

function parentElementPath(path : ElementPath) : ElementPath {
  return path.slice(0, -1);
}

//function elementSegment(path : ElementPath) : ElementName | null {
//  return path.at(-1) ?? null;
//}

function pathToString(path: ElementPath) : string {
  return pathSeparator + path.join(pathSeparator);
}

function pathStartsWith(path: ElementPath, prefix: ElementPath): boolean {
  if (prefix.length > path.length)
    return false;
  return prefix.every((value, index) => path[index] === value);
}

function checkElementName(elementName: ElementName) {
  if (elementName === undefined)
    throw new Error("Element name is not defined");
  if (typeof(elementName) !== 'string')
    throw new Error("Element name is not a string");
  if (elementName.length === 0)
    throw new Error("Element name can not be an empty string");
  for (const invalidCharacter of invalidCharacters) {
    if (elementName.includes(invalidCharacter))
      throw new Error(`Element name «${elementName}» containts invalid characters`);
  }
}

function checkElementPath(elementPath: ElementPath)
{
  if (elementPath === undefined)
    throw new Error("Element path is not defined");
  if (! Array.isArray(elementPath))
    throw new Error("Element path is not an array");
  for (const elementName of elementPath) {
    try {
      checkElementName(elementName);
    }
    catch(error: any) {
      throw new Error(`${error.message} in path «${pathToString(elementPath)}»`);
    }
  }
}

export {
  ElementName,
  ElementPath,
  elementPath,
  elementPathAreEquals,
  parentElementPath,
  pathToString,
  pathStartsWith,
  checkElementName,
  checkElementPath
};
