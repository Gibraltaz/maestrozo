/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath, MtzElement } from "@/Element";
import { componentTypeName, componentTypePath, inputPinTypePath, linkTypeContainerPath, messageQueuePath, outputPinTypePath, rootName, rootTypeContainerName, typeElementName } from '@/global';
import { pathStartsWith, pathToString } from "@/path";
import { CallbackName, CreateChildElementHelper, GetElementHelper, TypeDeclaration } from '@/typeHandlers/TypeHandler';
import { BuildElementDataCallback, BuildElementDataFunction } from "./elementTypeHandler";
import { MtzEngine } from "@/Engine";
import { connectionTypeName } from "./connectionTypeHandler";
import { MESSAGE_TYPE_CHANGE, MtzMessage, MtzMessageQueue, mtzMessageQueuePushMessage } from "@/MessageQueue";

const EvaluateComponentCallback = 'evaluate-component' as CallbackName;
const BuildComponentCallback = 'build-component' as CallbackName;

type BuildComponentHelpers = {
  getElement: GetElementHelper,
  createChildElement: CreateChildElementHelper
};

type BuildComponentResult = void; 

type BuildComponentFunction = (
  element: MtzElement,
  params:Record<string, any>,
  helpers: BuildComponentHelpers
) => Promise<BuildComponentResult>;


const buildElementDataFunction : BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>
): Promise<ElementData> => {
  throw new Error(`Cannot instantiate component type «${pathToString(componentTypePath)}»`);
};

type GetChildHelper = (elementName: ElementName) => Promise<MtzElement | null>;
type PostInputChangedToChild = (elementName: ElementName, pinName: ElementName, value: any) => Promise<void>;

type EvaluateComponentHelpers = {
  getChild: GetChildHelper,
  postInputChangedToChild: PostInputChangedToChild
};

type EvaluteComponentResult = {
  setData: ElementData | null;
  setOutputs: Array<{
    pin: ElementName;
    value: unknown;
  }> | null;
};

type EvaluateComponentFunction = (
  element: MtzElement,
  params:Record<string, any>,
  helpers: EvaluateComponentHelpers,
) => Promise<EvaluteComponentResult>;

const evaluateComponentFunction: EvaluateComponentFunction = async (
  _element: MtzElement,
  _data:Record<string, any>,
  _helpers: EvaluateComponentHelpers,
) : Promise<EvaluteComponentResult> => {
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
    { name: BuildElementDataCallback, function: buildElementDataFunction },
    { name: EvaluateComponentCallback , function: evaluateComponentFunction }
  ]
};

const connectComponents = async (
  engine: MtzEngine,
  parentPath: ElementPath,
  sourceComponentName: ElementName,
  sourcePinName: ElementName,
  targetComponentName: ElementName,
  targetPinName: ElementName

): Promise<MtzElement> => {

  const sourceComponentPath = [...parentPath, sourceComponentName];
  const sourceComponent = await engine.getElement([...sourceComponentPath]);
  if (sourceComponent === null)
    throw new Error(`Can not find source component «${pathToString(sourceComponentPath)}»`);
  if (! pathStartsWith(sourceComponent.elementType, componentTypePath))
    throw new Error(`Element «${pathToString(sourceComponentPath)} is not a component»`);

  const sourcePinPath = [...sourceComponentPath, sourcePinName];
  const sourcePin = await engine.getElement(sourcePinPath);
  if (sourcePin === null)
    throw new Error(`Can not find connection source pin «${sourcePinName}» in component «${pathToString(sourceComponentPath)}»`);
  if (! pathStartsWith(sourcePin.elementType, outputPinTypePath))
    throw new Error(`Element «${sourcePinName}» in component «${pathToString(sourceComponentPath)} is not an output pin»`);


  const targetComponentPath = [...parentPath, targetComponentName];
  const targetComponent = await engine.getElement([...targetComponentPath]);
  if (targetComponent === null)
    throw new Error(`Can not find target component «${pathToString(targetComponentPath)}»`);
  if (! pathStartsWith(targetComponent.elementType, componentTypePath))
    throw new Error(`Element «${pathToString(targetComponentPath)} is not a component»`);

  const targetPinPath = [...targetComponentPath, targetPinName];
  const targetPin = await engine.getElement(targetPinPath);
  if (targetPin === null)
    throw new Error(`Can not find connection target pin «${targetPinName}» in component «${pathToString(targetComponentPath)}»`);
  if (! pathStartsWith(targetPin.elementType, inputPinTypePath))
    throw new Error(`Element «${targetPinName}» in component «${pathToString(targetComponentPath)} is not an input pin»`);


  // FIXME déclarer officiellement le séparateur «|» comme caractère interdit
  const elementName = `${sourceComponentName}|${sourcePinName}|${targetComponentName}|${targetPinName}` as ElementName;

  const connectionElement = engine.createElement(
    elementName,
    parentPath,
    [ ...linkTypeContainerPath, connectionTypeName ] as ElementPath,
    {
      sourceComponent: sourceComponentName,
      sourcePin: sourcePinName,
      targetComponent: targetComponentName,
      targetPin: targetPinName
    }
  );

  // propager la valeur de la sortie à l'entrée connectée si elle est déterminée
  // FIXME est-il utile de tester si data.value === null ?
  if (sourcePin.data !== null && sourcePin.data.value !== null) {
      const message: MtzMessage  = {
        at: engine.timeFunction(),
        elementPath: [...targetComponent.parentPath, targetComponent.elementName],
        messageType: MESSAGE_TYPE_CHANGE,
        data: {
          pin: targetPinName,
          value: sourcePin.data.value,
        }
      };

      const messageQueueElement = await engine.getElement(messageQueuePath);
      if (messageQueueElement.data === null)
        throw new Error("Message queue data should not be null");
      const messageQueue = {
        messages: messageQueueElement.data.messages
      } as MtzMessageQueue;
      mtzMessageQueuePushMessage(messageQueue, message);
      await engine.modifyElement(messageQueueElement);
  }

  return connectionElement;
};

export { 
  componentTypeDeclaration, componentTypeName,
  BuildComponentCallback, BuildComponentFunction, BuildComponentResult, BuildComponentHelpers,
  EvaluateComponentCallback, EvaluateComponentFunction, EvaluteComponentResult, EvaluateComponentHelpers, 
  connectComponents,
};

