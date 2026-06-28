/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { IDataFactory } from '@/interfaces/IDataFactory';
import { IData } from '@/interfaces/IData';
import { ElementName } from '@/global/types';

class StringData implements IData {
  dataFactory : IDataFactory;
  value: string;

  constructor (factory : IDataFactory , value : string) {
    this.dataFactory = factory;
    this.value = value;
  }
}

class StringDataFactory implements IDataFactory {
  typeName = 'string' as ElementName;

  createInstance(params: Record<string, unknown>): IData {
    const stringValue = params['value'];
    if (stringValue === undefined )
      throw new Error("Value parameter is not defined");
    if (typeof(stringValue) !== 'string')
      throw new Error("Value parameter is not a string");
    const stringData = new StringData(this, stringValue);
    return stringData;
  }

  controlValue(value: any): void {
    if (value === undefined)
      throw new Error("String data value is not defined");
    if (typeof(value) !== 'string')
      throw new Error(`Value «${value}» is not a string`);
  }


}

export { StringDataFactory, StringData };
