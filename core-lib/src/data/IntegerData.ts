/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { IDataFactory } from '@/interfaces/IDataFactory';
import { IData } from '@/interfaces/IData';
import { ElementName } from '@/global/types';

class IntegerData implements IData {
  dataFactory : IDataFactory;
  value: number | null;

  constructor (factory : IDataFactory , value : number | null) {
    this.dataFactory = factory;
    this.value = value;
  }
}

class IntegerDataFactory implements IDataFactory {
  typeName = 'integer' as ElementName;

  createInstance(params: Record<string, unknown>): IData {
    const integerValue = params?.['value'] || null;
    if (integerValue !== null) {
      if (typeof(integerValue) !== 'number' || isNaN(integerValue))
        throw new Error("Value parameter is not a number");
    }
    const integerData = new IntegerData(this, integerValue);
    return integerData;
  }

  controlValue(value: any): void {
    if (value === undefined)
      throw new Error("Integer data value is not defined");
    if (typeof(value) !== 'number')
      throw new Error(`Value «${value}» is not an integer`);
  }

}

export { IntegerDataFactory, IntegerData };
