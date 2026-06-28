/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { RootElement } from '@/RootElement';
import { MessageQueueImpl } from '@/MessageQueueImpl';
import { parentElementPath, pathToString } from '@/utils/path';
import { IComponent } from './interfaces/IComponent';
import { CustomComponentBuilder, EvaluateMessageFunction, PinDeclaration } from './components/CustomComponentBuilder';
import { ITypeContainer } from './interfaces/ITypeContainer';
import { ComponentTypeElement } from './ComponentTypeElement';
import { IRuntimeContainer } from './interfaces/IRuntimeContainer';
import { ITypeElement } from './interfaces/ITypeElement';
import { IComponentFactory } from './interfaces/IComponentFactory';
import { ComponentName, ComponentPath, ElementName, ElementPath, InputPinName, MessageTime, OutputPinName } from './global/types';
import { COMPONENT_MESSAGE_SCOPE, MESSAGE_CHANGE, MESSAGE_CREATION, PIN_MESSAGE_SCOPE } from "@/global/messages";
import { ComponentMessage, PinMessage } from './interfaces/MessageQueue';
import { PinConnectionTypeElementName, IPinConnectionFactory, IPinConnection } from '@/interfaces/IPinConnection';
import { IContainer } from './interfaces/IContainer';

type TimeFunction = () => MessageTime;

class Engine {
  private _version = '0.0.1';
  private _rootElement : RootElement;
  readonly messageQueue: MessageQueueImpl;
  private _timeFunction: TimeFunction = () => Date.now() as MessageTime;

  constructor() {
      this._rootElement = new RootElement();
      this.messageQueue = new MessageQueueImpl();
  }

  get version() {
      return this._version;
  }

  getRootElement() : RootElement {
      return this._rootElement;
  }

  setTimeFunction(timeFunction: TimeFunction) {
    this._timeFunction = timeFunction;
  }

  runOnce() {
    const now = this._timeFunction();
    const message = this.messageQueue.popMessage(now);
    if (message === undefined)
      return;

    const component = this._rootElement.findElementByPath(message.componentPath) as IComponent;
    if (component === undefined)
      throw new Error(`Can not find element with path «${pathToString(message.componentPath)}»`);

    const parentPath = parentElementPath(message.componentPath);
    const componentContainer = this._rootElement.findElementByPath(parentPath) as IContainer;

    const result = component.evaluate(message);
    if (result.setOutputs !== undefined) {
      if (! Array.isArray(result.setOutputs))
        throw new Error(`Evaluation of component «${pathToString(message.componentPath)}» does not return an array in «setOutputs»`);
      for (const setOutput of result.setOutputs) {

        const outputPinName = setOutput.pin;
        if (outputPinName === undefined)
          throw new Error(`Value of «setOutputs.pin» is not set in evaluation result of component «${pathToString(message.componentPath)}»`);
        if (typeof(outputPinName) !== 'string')
          throw new Error(`Value of «setOutputs.pin» is not a string in evaluation result of component «${pathToString(message.componentPath)}»`);
        const outputPin = component.getOutputPinByName(outputPinName);
        if (outputPin === null)
          throw new Error(
                `Pin «${outputPinName}» referenced in «setOutputs.pin» ` +
                `of the evaluation result for component «${pathToString(message.componentPath)}» does not exist.`
          );

        const newValue = setOutput.value;
        if (newValue === undefined)
          throw new Error(`Value of «${outputPinName}» is not set in evaluation result of component «${pathToString(message.componentPath)}»`);
        outputPin.dataFactory.controlValue(newValue);
        outputPin.value = newValue;

        for (const element of componentContainer.children) {

          // TODO implémenter la propagation aux entrées connectées
          if (element.kind === 'pin-connection')
            throw new Error("Propagation non implémentée");

        }
      }
    }
  }

  declareCustomComponent(
    componentTypeName: ElementName,
    typeContainerPath : ElementPath,
    inputPinDeclarations: PinDeclaration[],
    outputPinDeclarations: PinDeclaration[],
    evaluateMessageFunction: EvaluateMessageFunction
  ): ComponentTypeElement {

    const typeContainer = this._rootElement.findElementByPath(typeContainerPath) as ITypeContainer;
    if (typeContainer === undefined)
      throw new Error(`Can't find type container «${typeContainerPath}»`)
    if (! typeContainer.isContainer)
      throw new Error(`Element «${typeContainerPath}» is not a container`)

    const componentBuilder = new CustomComponentBuilder(
        componentTypeName,
        inputPinDeclarations,
        outputPinDeclarations,
        typeContainer,
        evaluateMessageFunction
      );

    const componentTypeElement = typeContainer.declareComponentType(componentBuilder);

    return componentTypeElement;
  }

  createComponent(
    componentName: ComponentName,
    parentContainerPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>
  ): IComponent 
  {
    const runtimeContainer = this._rootElement.findElementByPath(parentContainerPath) as IRuntimeContainer;
    if (runtimeContainer === undefined) // FIXME utile si exception générée
      throw new Error(`Can't find parent container «${parentContainerPath}»`)

    const typeElement = this._rootElement.findElementByPath(typePath) as ITypeElement;
    if (typeElement === undefined) // FIXME utile si exception générée
      throw new Error(`Can't find type «${typePath}»`)

    const componentFactory = typeElement.factory as IComponentFactory;

    const component = runtimeContainer.createComponent(
      componentName,
      componentFactory,
      params
    );

    const message: ComponentMessage  = {
      at: this._timeFunction() as MessageTime,
      scope: COMPONENT_MESSAGE_SCOPE,
      event: MESSAGE_CREATION,
      componentPath: component.path as ComponentPath
    };
    this.messageQueue.pushMessage(message);

    return component;
  }

  createPinConnection(
    containerPath: ElementPath ,
    sourceComponentName: ComponentName,
    sourcePinName: OutputPinName,
    targetComponentName: ComponentName,
    targetPinName: InputPinName,
  ): IPinConnection 
  {
    const runtimeContainer = this._rootElement.findElementByPath(containerPath) as IRuntimeContainer;
    if (runtimeContainer === undefined) // FIXME utile si exception générée
      throw new Error(`Can't find parent container «${containerPath}»`)

    const sourceComponent = runtimeContainer.getComponentByName(sourceComponentName);
    const sourcePin = sourceComponent.getOutputPinByName(sourcePinName);

    const targetComponent = runtimeContainer.getComponentByName(targetComponentName);
    const targetPin = targetComponent.getInputPinByName(targetPinName);

    const pinConnectionType = this._rootElement
      .typesContainer.pinConnectionTypeContainer
      .getElementByName(PinConnectionTypeElementName) as ITypeElement;

    const pinConnection = runtimeContainer.createPinConnection(
      sourceComponent, sourcePin,
      targetComponent, targetPin,
      pinConnectionType.factory as IPinConnectionFactory
    );

    // si la valeur de la sortie est déterminée, la propager à la sortie connectée
    if (sourcePin.value !== null) {

      for (const element of runtimeContainer.children) {

        if (element.kind !== 'pin-connection')
          continue;
        const pinConnection = element as IPinConnection;

        if (pinConnection.targetComponentName !== targetComponentName)
          continue;
        if (pinConnection.targetPinName !== targetPinName)
          continue;

        const message: PinMessage  = {
          at: this._timeFunction() as MessageTime,
          scope: PIN_MESSAGE_SCOPE,
          event: MESSAGE_CHANGE,
          componentPath: targetComponent.path as ComponentPath,
          inputPinName: targetPin.name,
          value: sourcePin.value
        };
        this.messageQueue.pushMessage(message);
      }
    }

    return pinConnection;
  }

}

export { Engine };
