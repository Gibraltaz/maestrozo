/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { IDataFactory } from '@/interfaces/IDataFactory';
import { IData } from '@/interfaces/IData';
import { ElementName } from '@/global/types';

class BooleanData implements IData {
  dataFactory : IDataFactory;
  value: boolean;

  constructor (factory : IDataFactory , value : boolean) {
    this.dataFactory = factory;
    this.value = value;
  }
}

class BooleanDataFactory implements IDataFactory {
  typeName = 'boolean' as ElementName;

  createInstance(params: Record<string, unknown>): IData {
    const booleanValue = params['value'];
    if (booleanValue === undefined )
      throw new Error("Value parameter is not defined");
    if (typeof(booleanValue) !== 'boolean')
      throw new Error("Value parameter is not a boolean");
    const booleanData = new BooleanData(this, booleanValue);
    return booleanData;
  }

}

export { BooleanDataFactory, BooleanData };
