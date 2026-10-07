/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright (C) 2026 Executive Gibraltaz
*/

import { MaestrozoStore, StoreKey } from '@/store/MaestrozoStore';
import { RawMemoryStore } from '@/store/RawMemoryStore';
import {
  checkElementName,
  checkElementPath,
  rootName,
  pathStartsWith,
  pathToString,
  getElementPath,
  elementPathAreEquals,
  pathEquals,
} from '@/path';
import { MtzElement, ElementName, ElementPath, checkElement, ElementData } from '@/Element';
import {
  containerTypeName,
  rootTypeContainerName,
  dataTypeName,
  pinTypeContainerName,
  linkTypeContainerName,
  systemContainerName,
  systemContainerPath,
  runtimeContainerName,
  messageQueueName,
  messageQueuePath,
  componentTypePath,
  outputPinTypePath,
} from '@/global';

import { BuildDataFunction, BuildElementFunction, BuildHelpers, TypeDeclaration, TypeHandler } from '@/typeHandlers/TypeHandler';

import { containerTypeDeclaration} from '@/typeHandlers/containerTypeHandler';
import { integerTypeDeclaration } from '@/typeHandlers/integerTypeHandler';
import { stringTypeDeclaration } from '@/typeHandlers/stringTypeHandler';
import { booleanTypeDeclaration } from '@/typeHandlers/booleanTypeHandler';
import { inputPinTypeDeclaration, outputPinTypeDeclaration } from '@/typeHandlers/pinTypeHandlers';

import {
  BuildComponentCallback, componentTypeDeclaration, EvaluateComponentCallback,
  EvaluateComponentFunction, EvaluateComponentHelpers, EvaluationResult
} from './typeHandlers/componentTypeHandler';

import { compositeComponentTypeDeclaration, compositeComponentTypePath } from '@/typeHandlers/compositeComponentTypeHandler';
import { constantComponentTypeDeclaration } from '@/typeHandlers/constantComponentTypeHandler';
import { variableComponentTypeDeclaration } from '@/typeHandlers/variableComponentTypeHandler';
import { BuildElementDataCallback, elementTypeDeclaration } from '@/typeHandlers/elementTypeHandler';
import { typeTypeDeclaration } from '@/typeHandlers/typeTypeHandler';
import { connectionTypeDeclaration, connectionTypePath } from '@/typeHandlers/connectionTypeHandler';
import { messageTypeDeclaration, messageQueueTypeDeclaration } from '@/typeHandlers/messageTypeHandlers';

import {
  MESSAGE_TYPE_CHANGE, MtzMessage, MtzMessageQueue, mtzMessageQueuePopMessage,
  mtzMessageQueuePushMessage, MtzMessageTime, MtzTimeFunction
} from './MessageQueue';



type ContainerDeclaration = {
  elementName: ElementName,
  parentPath: ElementPath,
  isVolatile: boolean
};


class MtzEngine {
  private _initialized = false;
  private persistentStorage: MaestrozoStore| null = null;
  private volatileStore: MaestrozoStore = new RawMemoryStore;
  public timeFunction: MtzTimeFunction = () => Date.now() as MtzMessageTime;

  private async getStoredElement(elementPath: ElementPath): Promise<MtzElement> {
    const storeKey = pathToString(elementPath) as StoreKey;
    let element = await this.volatileStore.getItem(storeKey);
    if (element === null) {
      if (this.persistentStorage === null)
        throw new Error("Persistent storage is null");
      element = await this.persistentStorage.getItem(storeKey);
    }
    return element;
  }

  private async storeElement(element: MtzElement): Promise<void> {
    const elementPath = getElementPath(element);
    const storeKey = pathToString(elementPath) as StoreKey;
    if (element.isVolatile)
      await this.volatileStore.setItem(storeKey , element);
    else {
      if (this.persistentStorage === null)
        throw new Error("Persistent storage is null");
      await this.persistentStorage.setItem(storeKey , element);
    }
  }

  private async storeNewElement(element: MtzElement): Promise<void> {

    checkElement(element);

    const elementPath = getElementPath(element);
    if (await this.getStoredElement(elementPath))
      throw new Error(`Element «${elementPath}» already exists`);

    let parentElement;
    if (element.elementName === rootName && element.parentPath.length === 0) {
      parentElement = null; // l'élément racine n'a pas de parent
    }
    else {
      const parentPath = element.parentPath;
      parentElement = await this.getStoredElement(parentPath);
      if (parentElement === null)
        throw new Error(`Parent of element «${pathToString(parentPath)}» does not exist`);
      if (! parentElement.isContainer)
        throw new Error(`Parent of element «${pathToString(parentPath)}» is not a container`);
    }

    if (element.isContainer) {
      if (element.childNames === null)
        throw new Error(`Child name list not initialized in container «${pathToString(elementPath)}»`);
    }
    else {
      if (element.childNames !== null)
        throw new Error(`Child name list initialized in non-container «${pathToString(elementPath)}»`);
    }

    if (element.revision !== 0)
      throw new Error(`Revision of new element «${pathToString(elementPath)}» must be zero`);
    element.revision = 1;


    await this.storeElement(element);

    if (parentElement) {
      const parentStoreKey = pathToString(element.parentPath) as StoreKey;
      if (parentElement.childNames === null)
        throw new Error(`Child name list not initialized in element «${parentStoreKey}»`);
      parentElement.childNames.push(element.elementName);
      if (parentElement.isVolatile) {
        await this.volatileStore.setItem(parentStoreKey , parentElement);
      }
      else {
        if (this.persistentStorage === null)
          throw new Error("Persistent storage is null");
        await this.persistentStorage.setItem(parentStoreKey , parentElement);
      }
    }
  };


  private async declareContainer(containerDeclaration: ContainerDeclaration): Promise<MtzElement> {

    const containerPath = [...containerDeclaration.parentPath, containerDeclaration.elementName] as ElementPath;

    let containerElement = await this.getStoredElement(containerPath);
    if (containerElement !== null) {
      if (containerDeclaration.isVolatile)
        throw new Error(`Container «${pathToString(containerPath)}» already exists`);
      return containerElement;
    }

    containerElement = {
      revision: 0,
      elementName: containerDeclaration.elementName,
      parentPath: containerDeclaration.parentPath,
      elementType: [rootName, rootTypeContainerName, containerTypeName],
      isContainer: true,
      isVolatile: containerDeclaration.isVolatile,
      childNames: [],
      data: null
    } as MtzElement;

    await this.storeNewElement(containerElement);
    return containerElement;
  }


  private async declareMessageQueue(): Promise<MtzElement> {
    let messageQueueElement = await this.getStoredElement(messageQueuePath);
    if (messageQueueElement === null) {
      messageQueueElement = await this.createElementInternal(
        messageQueueName,
        systemContainerPath,
        [...messageQueueTypeDeclaration.parentPath , messageQueueTypeDeclaration.elementName],
        {},
        true
      );
    }
    return messageQueueElement;
  }


  private async declareTypeInternal(typeDeclaration: TypeDeclaration, force: boolean): Promise<MtzElement> {

    if (! force) {
      if (await this.getStoredElement(typeDeclaration.parentPath) === null)
        throw new Error(`Parent «${pathToString(typeDeclaration.parentPath)}» does not exist`);

      if (await this.getStoredElement(typeDeclaration.elementType) === null)
        throw new Error(`Type «${pathToString(typeDeclaration.elementType)}» does not exist`);

      const isType = pathStartsWith(typeDeclaration.parentPath, [rootName, rootTypeContainerName]);
      if (! isType)
        throw new Error(`Type «${typeDeclaration.elementName}» should be declare in ${pathToString([rootName, rootTypeContainerName])}`);
    }

    const typePath = pathToString([...typeDeclaration.parentPath, typeDeclaration.elementName]);

    const isDerivable = typeDeclaration?.isDerivable ?? null;
    if (isDerivable === null)
      throw new Error(`Type «${typePath}» declaration has no «isDerivable» property`);

    const isContainer = typeDeclaration?.isContainer ?? null;
    if (isContainer === null)
      throw new Error(`Type «${typePath}» declaration has no «isContainer» property`);

    const isVolatile = typeDeclaration?.isVolatile ?? null;
    if (isVolatile === null)
      throw new Error(`Type «${typePath}» declaration has no «isVolatile» property`);

    const typeHandler: TypeHandler = {
      isContainer,
      isVolatile,
      callbacks: [...typeDeclaration?.callbacks ?? []]
    };

    const element = {
      revision: 0,
      elementName: typeDeclaration.elementName,
      parentPath: typeDeclaration.parentPath,
      elementType: typeDeclaration.elementType,
      isContainer: isDerivable ? true : false,
      isVolatile: true,
      childNames: isDerivable ? [] as Array<ElementName> : null,
      data: {
        typeHandler
      }
    } as MtzElement;

    await this.storeNewElement(element);
    return element;
  }

  public async declareType(typeDeclaration: TypeDeclaration): Promise<MtzElement> {
    return this.declareTypeInternal(typeDeclaration, false);
  }

  public async initialize (storage: MaestrozoStore) {

    this.volatileStore = new RawMemoryStore();
    this.persistentStorage = storage;

    // mise en place de root «#/»
    const rootElement = await this.declareContainer({
      elementName: rootName,
      parentPath: [] as ElementPath, // empty path exception because root as no parent
      isVolatile: false
    });

    // mise en place de «#/types»
    await this.declareContainer({
      elementName: rootTypeContainerName,
      parentPath: getElementPath(rootElement),
      isVolatile: true
    });

    // mise en place de «#/types/data»
    await this.declareContainer({
      elementName: dataTypeName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      isVolatile: true
    });

    // mise en place de «#/types/pins»
    await this.declareContainer({
      elementName: pinTypeContainerName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      isVolatile: true
    });

    // mise en place de «#/types/links»
    await this.declareContainer({
      elementName: linkTypeContainerName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      isVolatile: true
    });

    // mise en place de «#/runtime»
    await this.declareContainer({
        elementName: runtimeContainerName,
        parentPath: [rootName] as ElementPath,
        isVolatile: false
      }
    );

    // mise en place de «#/system»
    await this.declareContainer({
        elementName: systemContainerName,
        parentPath: [rootName] as ElementPath,
        isVolatile: false
      }
    );

    // mise en place de «#/types/type»
    // (type spécial qui représente le type de tous les éléments de type dans «/types»)
    await this.declareTypeInternal(typeTypeDeclaration, true);

    // mise en place de «#/types/element»
    await this.declareTypeInternal(elementTypeDeclaration, false);

    // mise en place de «#/types/container»
    await this.declareTypeInternal(containerTypeDeclaration, false);

    // mise en place de «#/types/data/integer»
    await this.declareTypeInternal(integerTypeDeclaration, false);

    // mise en place de «#/types/data/string»
    await this.declareTypeInternal(stringTypeDeclaration, false);

    // mise en place de «#/types/data/boolean»
    await this.declareTypeInternal(booleanTypeDeclaration, false);

    // mise en place de «#/types/pins/input-pin»
    await this.declareTypeInternal(inputPinTypeDeclaration, false);

    // mise en place de «#/types/pins/output-pin»
    await this.declareTypeInternal(outputPinTypeDeclaration, false);

    // mise en place de «#/types/components»
    await this.declareTypeInternal(componentTypeDeclaration, false);

    // mise en place de «#/types/components/composite»
    await this.declareTypeInternal(compositeComponentTypeDeclaration, false);

    // mise en place de «#/types/components/constant»
    await this.declareTypeInternal(constantComponentTypeDeclaration, false);

    // mise en place de «#/types/components/variable»
    await this.declareTypeInternal(variableComponentTypeDeclaration, false);

    // mise en place de «#/types/links/connection»
    await this.declareTypeInternal(connectionTypeDeclaration, false);

    // mise en place de «#/types/message-queue»
    await this.declareTypeInternal(messageQueueTypeDeclaration, false);

    // mise en place de «#/types/message»
    await this.declareTypeInternal(messageTypeDeclaration, false);

    // mise en place de «#/system/message-queue»
    await this.declareMessageQueue();

    this._initialized = true;
  }


  public async getElement(elementPath: ElementPath): Promise<MtzElement> {
    if (! this._initialized)
      throw new Error("Engine not initialized");
    return await this.getStoredElement(elementPath);
  }


  public async createElementInternal(
    elementName: ElementName,
    parentPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>,
    force: boolean
  ): Promise<MtzElement> {

    if (! force && ! this._initialized)
      throw new Error("Engine not initialized");

    // TODO à remonter dans MtzCore
    checkElementName(elementName);
    checkElementPath(parentPath);
    checkElementPath(typePath);

    const parentElement = await this.getStoredElement(parentPath);
    if (parentElement === null)
      throw new Error(`Parent element «${pathToString(parentPath)}» does not exist`);

    if (! parentElement.isContainer)
      throw new Error(`Parent element «${pathToString(parentPath)}» is not a container`);

    const elementPath = [...parentPath, elementName];
    const elementStoreKey = pathToString([...parentPath, elementName]) as StoreKey;
    if (await this.getStoredElement(elementPath) !== null)
      throw new Error(`Element «${elementStoreKey}» already exists`);

    const typeElement = await this.getStoredElement(typePath);
    if (typeElement === null)
      throw new Error(`Can not find parent «${pathToString(typePath)}»`);

    const typeHandler: TypeHandler | null = typeElement?.data?.typeHandler as TypeHandler ?? null;
    if ( typeHandler === null)
      throw new Error(`Type handler not defined in type «${pathToString(getElementPath(typeElement))}»`);

    const isContainer = typeHandler?.isContainer ?? null;
    if (isContainer === null)
      throw new Error(`Property «isContainer» not defined in type handler of type «${pathToString(getElementPath(typeElement))}»`);
    if (typeof(isContainer) !== 'boolean')
      throw new Error(`Property «isContainer» is not a boolean in type handler of type «${pathToString(getElementPath(typeElement))}»`);

    const isVolatile = typeHandler?.isVolatile ?? null;
    if (isVolatile === null)
      throw new Error(`Property «isVolatile» not defined in type handler of type «${pathToString(getElementPath(typeElement))}»`);
    if (typeof(isVolatile) !== 'boolean')
      throw new Error(`Property «isVolatile» is not a boolean in type handler of type «${pathToString(getElementPath(typeElement))}»`);
    if (parentElement.isVolatile && ! isVolatile)
      throw new Error(`Non volatile element «${pathToString(getElementPath(typeElement))}» can not be store in a volatile container`);

    const buildHelpers: BuildHelpers = {
      getElement: async (elementPath:ElementPath): Promise<MtzElement> => {
        return await this.getStoredElement(elementPath)
      },
      createChildElement: async (
        childElementName: ElementName,
        childElementType: ElementPath,
        childParams: Record<string, any>
      ): Promise<MtzElement>  => {
        const childElement = await this.createElement(
          childElementName,
          elementPath,
          childElementType,
          childParams,
        );
        return childElement;
      }
    }

    const buildElementDataCallback = typeHandler.callbacks.find(callback => callback.name === BuildElementDataCallback);
    let elementData = {} as ElementData;

    if (buildElementDataCallback !== undefined) {
      const buildElementDataFunction = buildElementDataCallback.function as BuildDataFunction;
      if (typeof(buildElementDataFunction) !== 'function')
        throw new Error(`Build element data callback in type «${pathToString(getElementPath(typeElement))}» is not a function`);
      elementData = await buildElementDataFunction(elementName, parentPath, params, buildHelpers);
    }

    let element = {
      revision: 0,
      elementName,
      parentPath,
      elementType: typePath,
      isContainer,
      isVolatile,
      childNames: isContainer ? [] : null,
      data: elementData
    } as MtzElement;

    await this.storeNewElement(element);

    const buildComponentCallback = typeHandler.callbacks.find(callback => callback.name === BuildComponentCallback);
    if (buildComponentCallback !== undefined) {
      const buildComponentFunction = buildComponentCallback.function as BuildElementFunction;
      if (typeof(buildComponentFunction) !== 'function')
        throw new Error(`Build component callback is not a function`);
      // TODO tester que l'élément est bien un composant
      await buildComponentFunction(element, params, buildHelpers);
      // relire l'élément car sa propriété childNames a changé si des éléments enfants ont été créés dans cet élément
      element = await this.getStoredElement(elementPath);
    }
    return element;
  }

  public async createElement(
    elementName: ElementName,
    parentPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>
  ): Promise<MtzElement> {
    return await this.createElementInternal(elementName, parentPath, typePath, params, false);
  }

  public async modifyElement(element: MtzElement): Promise<void> {
    const originalElement = await this.getStoredElement(getElementPath(element));
    if (originalElement === null)
      throw new Error(`Element «${pathToString(getElementPath(element))}» does not exist`);

    if (originalElement.revision !== element.revision)
      throw new Error(`Conflict in edition of element «${pathToString(getElementPath(element))}»`);

    element.revision++;
    await this.storeElement(element);
  }

  public get initialized() : boolean {
    return this._initialized;
  }


  setTimeFunction(timeFunction: MtzTimeFunction) {
    this.timeFunction = timeFunction;
  }

  public async runOnce(): Promise<boolean> {
    if (! this._initialized)
      throw new Error("Engine not initialized");

    const messageQueueElement = await this.getElement(messageQueuePath);
    if (messageQueueElement.data === null)
      throw new Error("Message queue data should not be null");

    const messageQueue = {
      messages: messageQueueElement.data.messages
    } as MtzMessageQueue;

    const now = this.timeFunction();
    const message = mtzMessageQueuePopMessage(messageQueue, now);
    if (message === null)
      return false;


    const componentPath = message.elementPath;
    const componentElement = await this.getElement(componentPath);
    if (componentElement === null)
      throw new Error(`Can not find component «${pathToString(componentPath)}»`);

    if (! pathStartsWith(componentElement.elementType, componentTypePath))
      throw new Error(`Element «${pathToString(componentPath)}» is not a component`);

    const componentType = await this.getElement(componentElement.elementType);
    if (componentType === null)
      throw new Error(`Can not find component type «${pathToString(componentElement.elementType)}»`);

    const typeHandler: TypeHandler = componentType?.data?.typeHandler ?? null;
    if (typeHandler === null)
      throw new Error(`Can not find type handler of «${pathToString(componentElement.elementType)}»`);

    const componentName = componentElement.elementName;
    const containerPath = componentElement.parentPath;
    const containerElement = await this.getElement(containerPath);
    const data = message.data;

    switch (message.messageType) {

      case MESSAGE_TYPE_CHANGE:

        const callback = typeHandler.callbacks.find(callback => callback.name === EvaluateComponentCallback);
        if (callback === undefined)
          throw new Error(`Evaluation function of component «${pathToString(message.elementPath)}» is not defined`);

        const evaluateComponentFunction = callback.function as EvaluateComponentFunction;
        if (typeof(evaluateComponentFunction ) !== 'function')
          throw new Error(`Evaluation function of component «${pathToString(message.elementPath)}» is not a function`);

        const evaluateComponentHelpers: EvaluateComponentHelpers = {
          // TODO autotest helper getChild
          getChild : async (childName:ElementName): Promise<MtzElement> => {
            const childPath = [...componentPath, childName];
            return await this.getStoredElement(childPath);
          },
          // TODO à transformer en fonction helper
          postInputChangedToChild: async (childComponentName: ElementName, childPinName: ElementName, newValue: any): Promise<void> => {
            const message: MtzMessage  = {
              at: this.timeFunction(),
              elementPath: [...componentPath, childComponentName],
              messageType: MESSAGE_TYPE_CHANGE,
              data: {
                pin: childPinName,
                value: newValue
              }
            };
            mtzMessageQueuePushMessage(messageQueue, message);
          }
        }
        const result: EvaluationResult  = await evaluateComponentFunction(componentElement, data, evaluateComponentHelpers);

        // cas spécial n°1 du composant composite
        if (pathStartsWith(componentElement.elementType, compositeComponentTypePath)) {

          // mise à jour de la valeur de l'entrée ou de la sortie du composant composite
          const pinPath: ElementPath = [...componentPath, data.pin];
          const pin = await this.getElement(pinPath)
          if (pin.data === null)
            pin.data = {};
          pin.data.value = data.value;
          await this.modifyElement(pin);

          // pour une sortie, propager le changement aux composants externes liés
          if (pathEquals(pin.elementType, outputPinTypePath)) {
            assert(containerElement.childNames !== null);
            for (const childName of containerElement.childNames) {
              const childElement = await this.getElement([...containerPath, childName]);

              // ne traiter que les connexions
              if (! pathEquals(childElement.elementType, connectionTypePath))
                continue;

              const connection = childElement.data;
              assert(connection !== null);

              // ne traiter que les connexions liées à la sortie du composant composite
              if (connection.sourceComponent !== componentElement.elementName)
                continue;
              if (connection.sourcePin !== data.pin)
                continue;

              const targetComponentName = connection.targetComponent;
              const targetPinName = connection.targetPin;
              const message: MtzMessage= {
                at: this.timeFunction(),
                elementPath: [...containerPath, targetComponentName],
                messageType: MESSAGE_TYPE_CHANGE,
                data: {
                  pin: targetPinName,
                  value: data.value
                }
              };

              mtzMessageQueuePushMessage(messageQueue, message);
            }

          }
        }

        // demande de changement de l'état interne du composant
        if (result.setData !== null) {
          componentElement.data = {...result.setData};
          await this.modifyElement(componentElement);
        }

        // demande de changement d'état des sorties du composant
        const setOutputsArray = result.setOutputs;
        if (setOutputsArray !== null) {
          if (! Array.isArray(setOutputsArray))
            throw new Error(`Value of «setOutputs» in evaluation result of component «${pathToString(message.elementPath)}» is not an array`);

          for (const setOutputEntry of setOutputsArray) {

            const outputPinName = setOutputEntry.pin;
            if (outputPinName === undefined)
              throw new Error(`Value of «setOutputs.pin» is not set in evaluation result of component «${pathToString(message.elementPath)}»`);
            if (typeof(outputPinName) !== 'string')
              throw new Error(`Value of «setOutputs.pin» is not a string in evaluation result of component «${pathToString(message.elementPath)}»`);

            const outputPinValue = setOutputEntry.value;
            if (outputPinValue === undefined)
              throw new Error(`Value of «setOutputs.value» is not set in evaluation result of component «${pathToString(message.elementPath)}»`);


            if (containerElement.childNames === null)
              throw new Error("Internal error : container should have children");

            // balayer tous les enfants du conteneur du composant à la recherche des connexions liées à la sortie modifiée
            for (const childName of containerElement.childNames) {

              const childPath = [ ...containerPath, childName ] as ElementPath;
              const childElement = await this.getElement(childPath);
              if (childElement === null)
                throw new Error(`Can not find element «${pathToString(childPath)}»`);

              // ne traiter que les enfants du type connexion
              if (! elementPathAreEquals(childElement.elementType, connectionTypePath ))
                continue;

              // ne traiter que les connexions en sortie du composant
              const sourceComponentName = childElement?.data?.sourceComponent ?? null;
              if (sourceComponentName !== componentName)
                continue;

              // ne traiter que les connexions connectées à la sortie du composant
              const sourcePinName = childElement?.data?.sourcePin ?? null;
              if (sourcePinName !== outputPinName)
                continue;

              const connection = childElement;
              const targetComponentName = connection?.data?.targetComponent ?? null;
              const targetPinName = connection?.data?.targetPin ?? null;

              // TODO contrôler que le composant ou la broche accepte le type de la valeur

              // poster un message de mise jour du composant cible
              let message: MtzMessage;

              // cas spécial n°2 du composant composite
              if (targetComponentName === null) {
                // la connexion est liée à une sortie du composant composite
                message = {
                  at: this.timeFunction(),
                  elementPath: [...containerPath],
                  messageType: MESSAGE_TYPE_CHANGE,
                  data: {
                    pin: targetPinName, // targetComponentName
                    value: outputPinValue
                  }
                };
              }
              else
              {
                // la connexion est liée à une entrée d'un composant interne
                message = {
                  at: this.timeFunction(),
                  elementPath: [...containerPath, targetComponentName],
                  messageType: MESSAGE_TYPE_CHANGE,
                  data: {
                    pin: targetPinName,
                    value: outputPinValue
                  }
                };
              }
              mtzMessageQueuePushMessage(messageQueue, message);
            }
          }
        }
        break;

      default:
        // TODO déclencher un événement
        console.error(`Unknown message type «${message.messageType}»`);
        break;
    }

    await this.modifyElement(messageQueueElement);
    return true;
  }

}

export { MtzEngine, ElementName, ElementPath };
