/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MtzElement, ElementName, ElementPath } from './Element.js';
import { rootName } from './global.js';

const pathSeparator = '/';

const invalidCharacters = [ pathSeparator, rootName ];


function getElementPath(element: MtzElement): ElementPath {
  return [...element.parentPath, element.elementName];
}

// FIXME doublon avec pathEquals
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

function pathEquals(path1: ElementPath, path2: ElementPath): boolean {
  if (path1.length !== path2.length)
    return false;
  return path1.every((value, index) => path2[index] === value);
}


function checkElementName(elementName: ElementName, acceptRoot:boolean = false, what?:string) {
  if (what === undefined)
    what = 'Element name';
  if (elementName === undefined)
    throw new Error(`${what} is not defined`);
  if (typeof(elementName) !== 'string')
    throw new Error(`${what} is not a string`);
  if (elementName.length === 0)
    throw new Error(`${what} can not be an empty string`);
  for (const invalidCharacter of invalidCharacters) {
    if (acceptRoot && invalidCharacter === rootName )
      continue;
    if (elementName.includes(invalidCharacter)) {
      throw new Error(`${what} «${elementName}» contains invalid characters`);
    }
  }
}

function checkElementPath(elementPath: ElementPath, absolutePath = true, what?: string)
{
  if (what === undefined)
    what = 'Element path';
  if (elementPath === undefined)
    throw new Error(`${what} is not defined`);
  if (! Array.isArray(elementPath))
    throw new Error(`${what}Element path is not an array`);

  if (absolutePath) {
    if (elementPath.length === 0 || elementPath[0] != rootName)
      throw new Error(`${what} «${pathToString(elementPath)}» must be absolute but does not start with «${rootName}»`);
  }
  else {
    if (elementPath[0] == rootName)
      throw new Error(`${what} «${pathToString(elementPath)}» must be relative but does start with «${rootName}»`);
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

function checkAbsoluteElementPath(elementPath: ElementPath, what?: string) {
  checkElementPath(elementPath, true, what);
}

function checkRelativeElementPath(elementPath: ElementPath, what?: string) {
  checkElementPath(elementPath, false, what);
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
  ElementName, // TODO migration kernel réexport
  ElementPath, // TODO migration kernel réexport
  rootName, // TODO migration kernel réexport
  getElementPath,
  elementPathAreEquals,
  parentElementPath,
  pathToString,
  pathStartsWith,
  pathEquals,
  checkElementName,
  checkElementPath,
  checkAbsoluteElementPath,
  checkRelativeElementPath,
  isRootName,
};
