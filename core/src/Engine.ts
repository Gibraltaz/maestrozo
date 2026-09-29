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
} from '@/path';
import { MtzElement, ElementName, ElementPath, checkElement } from '@/Element';
import {
  containerTypeName,
  rootTypeContainerName,
  dataTypeName,
  componentTypeContainerName,
  pinTypeContainerName,
  linkTypeContainerName,
  linkTypeContainerPath,
  systemContainerName,
  systemContainerPath,
  runtimeContainerName,
  messageQueueName,
  messageQueuePath,
  componentTypeContainerPath
} from '@/global';

import { BuildDataFunction, BuildElementFunction, BuildHelpers, EvaluationResult, TypeDeclaration, TypeHandler } from '@/typeHandlers/TypeHandler';

import { containerTypeDeclaration} from './typeHandlers/containerTypeHandler';
import { integerTypeDeclaration } from './typeHandlers/integerTypeHandler';
import { stringTypeDeclaration } from './typeHandlers/stringTypeHandler';
import { booleanTypeDeclaration } from './typeHandlers/booleanTypeHandler';
import { inputPinTypeDeclaration, outputPinTypeDeclaration } from './typeHandlers/pinTypeHandlers';
import { constantComponentTypeDeclaration } from './typeHandlers/constantComponentTypeHandler';
import { variableComponentTypeDeclaration } from './typeHandlers/variableComponentTypeHandler';
import { elementTypeDeclaration } from './typeHandlers/elementTypeHandler';
import { typeTypeDeclaration } from './typeHandlers/typeTypeHandler';
import { connectionTypeDeclaration, connectionTypeName, connectionTypePath } from './typeHandlers/connectionTypeHandler';
import { messageTypeDeclaration, messageQueueTypeDeclaration } from './typeHandlers/messageTypeHandlers';
import { MESSAGE_TYPE_CHANGE, MtzMessage, MtzMessageQueue, mtzMessageQueuePopMessage, mtzMessageQueuePushMessage, MtzMessageTime, MtzTimeFunction } from './MessageQueue';


type ContainerDeclaration = {
  elementName: ElementName,
  parentPath: ElementPath,
  isVolatile: boolean
};


class MtzEngine {
  private _initialized = false;
  private persistentStorage: MaestrozoStore| null = null;
  private volatileStore: MaestrozoStore = new RawMemoryStore;
  private _timeFunction: MtzTimeFunction = () => Date.now() as MtzMessageTime;

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


  private async declareContainer(args: ContainerDeclaration): Promise<MtzElement> {

    const containerPath = [...args.parentPath, args.elementName] as ElementPath;

    let containerElement = await this.getStoredElement(containerPath);
    if (containerElement !== null) {
      if (args.isVolatile)
        throw new Error(`Container «${pathToString(containerPath)}» already exists`);
      return containerElement;
    }

    containerElement = {
      revision: 0,
      elementName: args.elementName,
      parentPath: args.parentPath,
      elementType: [rootName, rootTypeContainerName, containerTypeName],
      isContainer: true,
      isVolatile: args.isVolatile,
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


  private async declareTypeInternal(args: TypeDeclaration, force: boolean): Promise<MtzElement> {

    if (! force) {
      if (await this.getStoredElement(args.parentPath) === null)
        throw new Error(`Parent «${pathToString(args.parentPath)}» does not exist`);

      if (await this.getStoredElement(args.elementType) === null)
        throw new Error(`Type «${pathToString(args.elementType)}» does not exist`);

      const isType = pathStartsWith(args.parentPath, [rootName, rootTypeContainerName]);
      if (! isType)
        throw new Error(`Type «${args.elementName}» should be declare in ${pathToString([rootName, rootTypeContainerName])}`);
    }

    const typePath = pathToString([...args.parentPath, args.elementName]);

    const isDerivable = args?.isDerivable ?? null;
    if (isDerivable === null)
      throw new Error(`Type «${typePath}» declaration has no «isDerivable» property`);

    const isContainer = args?.isContainer ?? null;
    if (isContainer === null)
      throw new Error(`Type «${typePath}» declaration has no «isContainer» property`);

    const isVolatile = args?.isVolatile ?? null;
    if (isVolatile === null)
      throw new Error(`Type «${typePath}» declaration has no «isVolatile» property`);

    const buildDataFunction = args?.buildDataFunction ?? null;
    if (buildDataFunction === null)
      throw new Error(`Type «${typePath}» declaration has no buildDataFunction function`);

    const buildElementFunction=  args.buildElementFunction ?? null;

    const evaluateComponentFunction = args?.evaluateComponentFunction ?? null;

    const element = {
      revision: 0,
      elementName: args.elementName,
      parentPath: args.parentPath,
      elementType: args.elementType,
      isContainer: isDerivable ? true : false,
      isVolatile: true,
      childNames: isDerivable ? [] as Array<ElementName> : null,
      data: {
        typeHandler: {
          isContainer,
          isVolatile,
          buildDataFunction,
          buildElementFunction,
          evaluateComponentFunction
        }
      }
    } as MtzElement;

    await this.storeNewElement(element);
    return element;
  }

  public async declareType(args: TypeDeclaration): Promise<MtzElement> {
    return this.declareTypeInternal(args, false);
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

    // mise en place de «#/types/components»
    await this.declareContainer({
      elementName: componentTypeContainerName,
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

    const buildDataFunction: BuildDataFunction | null = typeHandler?.buildDataFunction ?? null;
    if (buildDataFunction === null)
      throw new Error(`Property «buildDataFunction» not defined in type «${pathToString(getElementPath(typeElement))}»`);
    if (typeof(buildDataFunction) !== 'function')
      throw new Error(`Property «buildDataFunction» not a function in type «${pathToString(getElementPath(typeElement))}»`);

    const buildElementFunction: BuildElementFunction | null = typeHandler?.buildElementFunction ?? null;
    if (buildElementFunction !== null && typeof(buildElementFunction) !== 'function')
      throw new Error(`Property «buildElementFunction» not a function in type «${pathToString(getElementPath(typeElement))}»`);

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

    const elementData = await buildDataFunction(elementName, parentPath, params, buildHelpers);

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

    if (buildElementFunction !== null) {
      // FIXME doit-on appeler cette fonction si isContainer vaut false ?
      await buildElementFunction(element, params, buildHelpers);
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

  public async createConnection(
    parentPath: ElementPath,
    sourceComponentName: ElementName,
    sourcePinName: ElementName,
    targetComponentName: ElementName,
    targetPinName: ElementName

  ): Promise<MtzElement> {

    if (! this._initialized)
      throw new Error("Engine not initialized");

    const sourcePin = await this.getElement([...parentPath, sourceComponentName, sourcePinName]);
    const targetComponent = await this.getElement([...parentPath, targetComponentName]);
    //const targetPin = await this.getElement([...parentPath, targetComponentName, targetPinName]);

    // FIXME déclarer officiellement le séparateur «|» comme caractère interdit
    const elementName = `${sourceComponentName}|${sourcePinName}|${targetComponentName}|${targetPinName}` as ElementName;

    const connectionElement = this.createElement(
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
          at: this._timeFunction(),
          elementPath: [...targetComponent.parentPath, targetComponent.elementName],
          messageType: MESSAGE_TYPE_CHANGE,
          data: {
            pin: targetPinName,
            value: sourcePin.data.value,
          }
        };

        const messageQueueElement = await this.getElement(messageQueuePath);
        if (messageQueueElement.data === null)
          throw new Error("Message queue data should not be null");
        const messageQueue = {
          messages: messageQueueElement.data.messages
        } as MtzMessageQueue;
        mtzMessageQueuePushMessage(messageQueue, message);
        await this.modifyElement(messageQueueElement);
    }

    return connectionElement;
  };

  setTimeFunction(timeFunction: MtzTimeFunction) {
    this._timeFunction = timeFunction;
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

    const now = this._timeFunction();
    const message = mtzMessageQueuePopMessage(messageQueue, now);
    if (message === null)
      return false;

    const data = message.data;

    const componentElement = await this.getElement(message.elementPath);
    if (componentElement === null)
      throw new Error(`Can not find component «${pathToString(message.elementPath)}»`);

    const componentName = componentElement.elementName;

    const containerElement = await this.getElement(componentElement.parentPath);
    const containerPath = [...containerElement.parentPath, containerElement.elementName] as ElementPath;

    if (! pathStartsWith(componentElement.elementType, componentTypeContainerPath  ))
      throw new Error(`Element «${pathToString(message.elementPath)}» is not a component`);

    const componentType = await this.getElement(componentElement.elementType);
    if (componentType === null)
      throw new Error(`Can not find component type «${pathToString(componentElement.elementType)}»`);

    const typeHandler: TypeHandler = componentType?.data?.typeHandler ?? null;
    if (typeHandler === null)
      throw new Error(`Can not find type handler of «${pathToString(componentElement.elementType)}»`);

    switch (message.messageType) {

      case MESSAGE_TYPE_CHANGE:

        const evaluateComponentFunction = typeHandler.evaluateComponentFunction;
        if (evaluateComponentFunction === undefined)
          throw new Error(`Evaluate component function of component «${pathToString(message.elementPath)}» is not defined`);
        if (evaluateComponentFunction === null)
          throw new Error(`Evaluate component function of component «${pathToString(message.elementPath)}» is not set`);
        if (typeof(evaluateComponentFunction) !== 'function')
          throw new Error(`Evaluate component function of component «${pathToString(message.elementPath)}» is not a function`);

        const result: EvaluationResult  = await evaluateComponentFunction(componentElement, data, null);

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

            // pour tous les enfants du conteneur du composant
            for (const childName of containerElement.childNames) {

              const childElement = await this.getElement([ ...containerPath, childName ] as ElementPath);

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

              const targetComponentName = childElement?.data?.targetComponent ?? null;
              const targetPinName = childElement?.data?.targetPin ?? null;

              // TODO contrôler que le composant ou la broche accepte le type de la valeur

              // poster un message de mise jour du composant cible
              const message: MtzMessage  = {
                at: this._timeFunction(),
                elementPath: [...containerPath, targetComponentName],
                messageType: MESSAGE_TYPE_CHANGE,
                data: {
                  pin: targetPinName,
                  value: outputPinValue
                }
              };
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

    return true;
  }

}

export { MtzEngine, ElementName, ElementPath };
