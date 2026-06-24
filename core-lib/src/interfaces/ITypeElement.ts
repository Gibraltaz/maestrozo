/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { IElement } from '@/interfaces/IElement';
import { ITypeFactory } from '@/interfaces/ITypeFactory';

interface ITypeElement extends IElement {
  readonly factory: ITypeFactory;
}

export { ITypeElement };
