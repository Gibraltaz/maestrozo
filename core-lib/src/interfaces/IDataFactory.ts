/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ITypeFactory } from '@/interfaces/ITypeFactory';
import { IData } from '@/interfaces/IData';

interface IDataFactory extends ITypeFactory {
  createInstance(params: Record<string, unknown>): IData;
  controlValue(value: any): void;
}

export { IDataFactory };
