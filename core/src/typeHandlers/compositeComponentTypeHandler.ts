/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementData, ElementName, ElementPath, MtzElement } from "@/Element";
import { rootName, rootTypeContainerName, componentTypeName, typeElementName, componentTypePath, inputPinTypePath, linkTypeContainerPath, messageQueuePath, outputPinTypePath } from '@/global';
import { BuildDataFunction, BuildHelpers, TypeDeclaration } from '@/typeHandlers/TypeHandler';
import { BuildElementDataCallback } from "./elementTypeHandler";
import { EvaluateComponentCallback, EvaluateComponentFunction, EvaluateComponentHelpers, EvaluationResult } from "./componentTypeHandler";
import { pathEquals, pathStartsWith, pathToString } from "@/path";
import { connectionTypeName, connectionTypePath } from "./connectionTypeHandler";
import { MtzEngine } from "@/Engine";
import { MESSAGE_TYPE_CHANGE, MtzMessage, MtzMessageQueue, mtzMessageQueuePushMessage } from "@/MessageQueue";

const compositeComponentTypeName = 'composite' as ElementName;

const buildDataFunction: BuildDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildHelpers
): Promise<ElementData> => {
  return {};
};

/**
 * Le composant composite reçoit le message avec le nom de la broche en entrée dont la valeur a changé.
 * Ce message doit déclencher la mise à jour du ou des composants internes qui sont liés à cette entrée.
 * Le composant balaye toutes les connexions internes liées à cette entrée et poster un message
 * à chaque composant lié.
 */
const evaluateComponentFunction: EvaluateComponentFunction = async (
  element: MtzElement,
  data:Record<string, any>,
  helpers: EvaluateComponentHelpers
) : Promise<EvaluationResult> => {
  assert(element.childNames !== null);
  //console.log("dOm evaluateComponentFunction - data", data);
  for (const childName of element.childNames) {
    const childElement = await helpers.getChild(childName);
    assert(childElement !== null);

    // ne traiter que les enfants de type connexion
    if (! pathEquals(childElement.elementType, connectionTypePath))
      continue;

    const connectionData = childElement.data;
    assert(connectionData !== null);

    // ne prendre en compte que les connexions liées au composant lui-même et à l'entrée concernée
    if (connectionData.sourceComponent !== null || connectionData.sourcePin !== data.pin)
      continue;

    //console.log("dOm evaluateComponentFunction - connectionData", connectionData);

    //TODO poster un message de mise à jour de son entrée au composant lié
    const connectedComponentName = connectionData.targetComponent;
    const connectedPinName = connectionData.targetPin;

    await helpers.postInputChangedToChild(connectedComponentName, connectedPinName, data.value);

  }

  const result = {
    setData: null,
    setOutputs: []
  } as EvaluationResult;
  return result;

};


const compositeComponentTypeDeclaration: TypeDeclaration = {
  elementName: compositeComponentTypeName,
  parentPath: [rootName, rootTypeContainerName, componentTypeName] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: true, // composite contains its output pin
  isVolatile: false,
  callbacks: [
    { name: BuildElementDataCallback, function: buildDataFunction },
    { name: EvaluateComponentCallback, function: evaluateComponentFunction }
  ]
};


const connectInputToComponent = async (
  engine: MtzEngine,
  compositeComponentPath: ElementPath,
  compositeComponentPinName: ElementName,
  childComponentName: ElementName,
  childPinName: ElementName
): Promise<MtzElement> => {

  const component = await engine.getElement([...compositeComponentPath]);
  if (component === null)
    throw new Error(`Can not find component «${pathToString(compositeComponentPath)}»`);
  if (! pathStartsWith(component.elementType, componentTypePath))
    throw new Error(`Element «${pathToString(compositeComponentPath)} is not a component»`);

  const sourcePinPath = [...compositeComponentPath, compositeComponentPinName];
  const sourcePin = await engine.getElement(sourcePinPath);
  if (sourcePin === null)
    throw new Error(`Can not find pin «${compositeComponentPinName}» in component «${pathToString(compositeComponentPath)}»`);
  if (! pathStartsWith(sourcePin.elementType, inputPinTypePath))
    throw new Error(`Element «${compositeComponentPinName}» in component «${pathToString(compositeComponentPath)} is not an input pin»`);


  const targetComponentPath = [...compositeComponentPath, childComponentName];
  const targetComponent = await engine.getElement([...targetComponentPath]);
  if (targetComponent === null)
    throw new Error(`Can not find component «${pathToString(targetComponentPath)}»`);
  if (! pathStartsWith(targetComponent.elementType, componentTypePath))
    throw new Error(`Element «${pathToString(targetComponentPath)} is not a component»`);

  const targetPinPath = [...targetComponentPath, childPinName];
  const targetPin = await engine.getElement(targetPinPath);
  if (targetPin === null)
    throw new Error(`Can not find pin «${childPinName}» in component «${pathToString(compositeComponentPath)}»`);
  if (! pathStartsWith(targetPin.elementType, inputPinTypePath))
    throw new Error(`Element «${childPinName}» in component «${pathToString(targetComponentPath)} is not an input pin»`);


  const elementName = `${compositeComponentPinName}|${childComponentName}|${childPinName}` as ElementName;

  const connectionElement = engine.createElement(
    elementName,
    compositeComponentPath,
    [ ...linkTypeContainerPath, connectionTypeName ] as ElementPath,
    {
      sourceComponent: null, //FIXME componentName,
      sourcePin: compositeComponentPinName,
      targetComponent: childComponentName,
      targetPin: childPinName
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
          pin: childPinName,
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


const connectComponentToOutput = async (
  engine: MtzEngine,
  compositeComponentPath: ElementPath,
  compositeComponentPinName: ElementName,
  childComponentName: ElementName,
  childPinName: ElementName
): Promise<MtzElement> => {

  const component = await engine.getElement([...compositeComponentPath]);
  if (component === null)
    throw new Error(`Can not find component «${pathToString(compositeComponentPath)}»`);
  if (! pathStartsWith(component.elementType, componentTypePath))
    throw new Error(`Element «${pathToString(compositeComponentPath)} is not a component»`);

  const targetPinPath = [...compositeComponentPath, compositeComponentPinName];
  const targetPin = await engine.getElement(targetPinPath);
  if (targetPin === null)
    throw new Error(`Can not find pin «${compositeComponentPinName}» in component «${pathToString(compositeComponentPath)}»`);
  if (! pathStartsWith(targetPin.elementType, outputPinTypePath))
    throw new Error(`Element «${compositeComponentPinName}» in component «${pathToString(compositeComponentPath)} is not an output pin»`);


  const sourceComponentPath = [...compositeComponentPath, childComponentName];
  const sourceComponent = await engine.getElement([...sourceComponentPath]);
  if (sourceComponent === null)
    throw new Error(`Can not find component «${pathToString(sourceComponentPath)}»`);
  if (! pathStartsWith(sourceComponent.elementType, componentTypePath))
    throw new Error(`Element «${pathToString(sourceComponentPath)} is not a component»`);

  const sourcePinPath = [...sourceComponentPath, childPinName];
  const sourcePin = await engine.getElement(sourcePinPath);
  if (sourcePin === null)
    throw new Error(`Can not find pin «${childPinName}» in component «${pathToString(compositeComponentPath)}»`);
  if (! pathStartsWith(targetPin.elementType, outputPinTypePath))
    throw new Error(`Element «${childPinName}» in component «${pathToString(sourceComponentPath)} is not an output pin»`);


  const elementName = `${childComponentName}|${childPinName}|${compositeComponentPinName}` as ElementName;

  const connectionElement = engine.createElement(
    elementName,
    compositeComponentPath,
    [ ...linkTypeContainerPath, connectionTypeName ] as ElementPath,
    {
      sourceComponent: childComponentName,
      sourcePin: childPinName,
      targetComponent: null, //FIXME componentName,
      targetPin: compositeComponentPinName
    }
  );

  // TODO propager la valeur de la sortie à l'entrée connectée si elle est déterminée

  return connectionElement;

};


export {
  compositeComponentTypeDeclaration, compositeComponentTypeName,
  connectInputToComponent,
  connectComponentToOutput,
};

