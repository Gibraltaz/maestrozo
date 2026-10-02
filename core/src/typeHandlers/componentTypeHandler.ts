/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath, MtzElement } from "@/Element";
import { componentTypeName, componentTypePath, rootName, rootTypeContainerName, typeElementName } from '@/global';
import { pathToString } from "@/path";
import { BuildDataFunction, BuildHelpers, CallbackName, TypeDeclaration } from '@/typeHandlers/TypeHandler';
import { BuildElementDataCallback } from "./elementTypeHandler";

const EvaluateComponentCallback = 'evaluate-component' as CallbackName;
const BuildComponentCallback = 'build-component' as CallbackName;

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
  callbacks: [
    { name: BuildElementDataCallback, function: buildDataFunction },
    { name:EvaluateComponentCallback , function: evaluateComponentFunction }
  ]
};


export { 
  componentTypeDeclaration, componentTypeName,
  EvaluateComponentFunction, EvaluationResult,
  EvaluateComponentCallback, BuildComponentCallback 
};

