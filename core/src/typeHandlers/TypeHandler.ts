/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MtzElement, ElementName, ElementPath } from "@/Element";

type GetElementHelper = (elementPath: ElementPath) => Promise<MtzElement | null>;

type CreateChildElementHelper = (
  childElementName: ElementName,
  childElementType: ElementPath,
  childParams: Record<string, any>
) => Promise<MtzElement>;


type CallbackName = string & { __brand:'CallbackName' };

type CallbackDeclaration = {
  name: CallbackName,
  function: Function;
};

type TypeHandler = {
  isContainer: boolean,
  isVolatile: boolean
  callbacks: Array<CallbackDeclaration>
};



type TypeDeclaration = {
  elementName:ElementName,
  parentPath: ElementPath,
  elementType: ElementPath,
  isDerivable: boolean, // le type peut-il être dérivé en sous-type
  isContainer: boolean, // un élément de ce type peut-il contenir d'autres éléments
  isVolatile: boolean, // un élément de ce type est-il recréé à chaque fois (ou sauvegardé)
  callbacks: Array<CallbackDeclaration>
};


export {
  TypeDeclaration,
  TypeHandler,
  CallbackName,
  CallbackDeclaration,
  GetElementHelper,
  CreateChildElementHelper 
};
