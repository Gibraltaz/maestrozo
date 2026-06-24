/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ITypeFactory } from '@/interfaces/ITypeFactory';
import { ElementName, ElementPath } from '@/global/types';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { Message } from '@/global/messages';

interface IComponentFactory extends ITypeFactory {
  createInstance(componentName: ElementName, parentElementPath: ElementPath,params: Record<string, unknown>): IComponent;
  evaluateComponent(component: IComponent, message: Message) : EvaluationResult;
}

export { IComponentFactory };
