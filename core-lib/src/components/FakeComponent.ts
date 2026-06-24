/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { ComponentName, ElementName, ElementPath } from '@/global/types';
import { Message } from '@/global/messages';
import { AbstractComponent } from './AbstractComponent';

class FakeComponent extends AbstractComponent {

  constructor (componentName: ComponentName, parentElementPath: ElementPath, factory : IComponentFactory ) {
    super(componentName, parentElementPath, factory);
  }

  evaluate(_message: Message): EvaluationResult {
    throw new Error('Method not implemented.');
  }

}

class FakeComponentFactory implements IComponentFactory {
  typeName = 'fake-component' as ElementName;

  createInstance(componentName: ComponentName, parentElementPath: ElementPath, _params: Record<string, unknown>): IComponent {
    const fakeComponent = new FakeComponent(componentName, parentElementPath, this);
    return fakeComponent;
  }

  evaluateComponent(_component: IComponent): EvaluationResult {
      throw new Error('Method not implemented.');
  }

}

export { FakeComponentFactory, FakeComponent };
