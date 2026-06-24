/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { IDataFactory } from '@/interfaces/IDataFactory';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { IContainer } from '@/interfaces/IContainer';
import { DataTypeElement } from '@/DataTypeElement';
import { ComponentTypeElement } from '@/ComponentTypeElement';

interface ITypeContainer extends IContainer {
  declareDataType(dataFactory : IDataFactory) : DataTypeElement;
  declareComponentType(componentFactory : IComponentFactory) : ComponentTypeElement;
};

export { ITypeContainer };
