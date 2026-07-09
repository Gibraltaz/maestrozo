/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { Element, ElementName, ElementPath } from '@/Element';

const pathSeparator = '/';
const rootName = '#';

const invalidCharacters = [ pathSeparator, rootName ];


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

function checkElementName(elementName: ElementName, acceptRoot:boolean = false) {
  if (elementName === undefined)
    throw new Error("Element name is not defined");
  if (typeof(elementName) !== 'string')
    throw new Error("Element name is not a string");
  if (elementName.length === 0)
    throw new Error("Element name can not be an empty string");
  for (const invalidCharacter of invalidCharacters) {
    if (acceptRoot && invalidCharacter === rootName )
      continue;
    if (elementName.includes(invalidCharacter)) {
      throw new Error(`Element name «${elementName}» containts invalid characters`);
    }
  }
}

function checkElementPath(elementPath: ElementPath, absolutePath = false)
{
  if (elementPath === undefined)
    throw new Error("Element path is not defined");
  if (! Array.isArray(elementPath))
    throw new Error("Element path is not an array");

  if (absolutePath) {
    if (elementPath.length === 0 || elementPath[0] != rootName)
      throw new Error(`Absolute path must start start with «${rootName}»`);
  }
  else {
    if (elementPath[0] == rootName)
      throw new Error(`Relative path must start start with «${rootName}»`);
  }

  let i = 1;
  for (const elementName of elementPath) {
    try {
      if (i === 1 && absolutePath)
        checkRootElementName(elementName);
      else
        checkElementName(elementName, false);
      i++;
    }
    catch(error: any) {
      throw new Error(`${error.message} in path «${pathToString(elementPath)}» at position ${i}`);
    }
  }
}

function checkAbsoluteElementPath(elementPath: ElementPath) {
  checkElementPath(elementPath, true);
}

function checkRelativeElementPath(elementPath: ElementPath) {
  checkElementPath(elementPath, false);
}

function checkRootElementName(elementName: ElementName): void {
  if (elementName === undefined)
    throw new Error("Element name is not defined");
  if (typeof(elementName) !== 'string')
    throw new Error("Element name is not a string");
  if (elementName != rootName)
    throw new Error(`Element name «${elementName}» is not root element «${rootName}»`);
}

function isRootName(elementName: ElementName): boolean {
  if (elementName === undefined)
    throw new Error("Element name is not defined");
  if (typeof(elementName) !== 'string')
    throw new Error("Element name is not a string");
  return (elementName == rootName);
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
  checkElementPath,
  checkAbsoluteElementPath,
  checkRelativeElementPath,
  isRootName,
};
