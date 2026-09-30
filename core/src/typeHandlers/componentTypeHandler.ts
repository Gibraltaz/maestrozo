/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath, MtzElement } from "@/Element";
import { componentTypeName, componentTypePath, rootName, rootTypeContainerName, typeElementName } from '@/global';
import { pathToString } from "@/path";
import { BuildDataFunction, BuildElementFunction, BuildHelpers, CallbackDeclaration, TypeDeclaration } from '@/typeHandlers/TypeHandler';


const buildDataFunction : BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error(`Cannot instantiate component type «${pathToString(componentTypePath)}»`);
};


type EvaluationResult = {
  setData: ElementData | null;
  setOutputs: Array<{
    pin: ElementName;
    value: unknown;
  }> | null;
};

type EvaluateComponentFunction = (
  element: MtzElement,
  params:Record<string, any>,
  helpers: BuildHelpers
) => Promise<EvaluationResult>;

type ComponentTypeHandler = {
  isContainer: boolean,
  isVolatile: boolean
  buildDataFunction: BuildDataFunction,
  buildElementFunction: BuildElementFunction | null,
  evaluateComponentFunction: EvaluateComponentFunction | null,
  callbacks: Array<CallbackDeclaration>
};

const evaluateComponentFunction: EvaluateComponentFunction = async (
  _element: MtzElement,
  _data:Record<string, any>,
  _helpers: BuildHelpers
) : Promise<EvaluationResult> => {
  throw new Error("Component evaluation function should not be called directly");
};


const componentTypeDeclaration: TypeDeclaration = {
  elementName: componentTypeName,
  parentPath: [rootName, rootTypeContainerName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: true,
  isContainer: true,
  isVolatile: true,
  buildDataFunction: buildDataFunction, 
  buildElementFunction: null,
  callbacks: [
    { name: 'evaluate-component', function: evaluateComponentFunction }
  ]
};


export { 
  ComponentTypeHandler ,
  componentTypeDeclaration, componentTypeName,
  EvaluateComponentFunction, EvaluationResult
};

