/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { CustomComponent } from "./CustomComponent";
import { IComponentFactory } from "@/interfaces/IComponentFactory";
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { ITypeContainer } from '@/interfaces/ITypeContainer';
import { DataTypeElement } from "@/DataTypeElement";
import { ComponentName, ElementName, ElementPath } from "@/global/types";
import { Message } from "@/global/messages";

type PinDeclaration = {
  name: ElementName;
  dataType: DataTypeElement;
  initialValuePropertyName: string; //FIXME mettre un type «PropertyName»
};

type EvaluateMessageFunction = (component: IComponent, message: Message) => EvaluationResult;

class CustomComponentBuilder implements IComponentFactory {
  typeName: ElementName;
  componentTypeContainer: ITypeContainer;
  private inputPinDeclarations: PinDeclaration[];
  private outputPinDeclarations: PinDeclaration[];
  private evaluateMessageFunction: EvaluateMessageFunction;

  constructor(
    typeName: ElementName,
    inputPinDeclarations: PinDeclaration[],
    outputPinDeclarations: PinDeclaration[],
    componentTypeContainer: ITypeContainer,
    evaluateMessageFunction: EvaluateMessageFunction
  ) {
    this.componentTypeContainer = componentTypeContainer;
    this.typeName = typeName;
    this.inputPinDeclarations = inputPinDeclarations;
    this.outputPinDeclarations = outputPinDeclarations;
    this.evaluateMessageFunction = evaluateMessageFunction;
  }

  createInstance(componentName: ComponentName, parentElementPath: ElementPath, params: Record<string, unknown>) : IComponent {
    const newComponent = new CustomComponent(componentName, parentElementPath, this);

    const inputPinsParamName = 'inputPins';
    const inputPinParams : Record<string, any> | undefined = params?.[inputPinsParamName] ?? {};

    for (const pinDeclaration of this.inputPinDeclarations) {
      const pinParameters: Record<string, unknown> = inputPinParams?.[pinDeclaration.name] ?? {}; 
      newComponent.declareInputPin(pinDeclaration.name, pinDeclaration.dataType, pinParameters );
    }

    const outputPinsParamName = 'outputPins';
    const outputPinParams : Record<string, any> | undefined = params?.[inputPinsParamName] ?? {};
    if (outputPinParams === null || typeof(outputPinParams) != 'object')
      throw new Error(`The «${outputPinsParamName}» section must be a key-value object while creating "${componentName}" component`);

    for (const pinDeclaration of this.outputPinDeclarations) {
      const pinParameters: Record<string, unknown> = outputPinParams?.[pinDeclaration.name] ?? {}; 
      newComponent.declareOutputPin(pinDeclaration.name, pinDeclaration.dataType, pinParameters );
    }

    return newComponent;
  }

  evaluateComponent(component: IComponent, message: Message): EvaluationResult {
    return this.evaluateMessageFunction(component, message);
  }
}

export { CustomComponentBuilder, PinDeclaration, EvaluateMessageFunction };
