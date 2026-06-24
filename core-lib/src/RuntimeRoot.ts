/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { RuntimeContainer } from '@/RuntimeContainer';
import { runtimeElementName } from './global/names';
import { ElementPath } from './global/types';

class RuntimeRoot extends RuntimeContainer {

  constructor() {
    super(runtimeElementName, [] as ElementPath);
  }

}

export { RuntimeRoot };
