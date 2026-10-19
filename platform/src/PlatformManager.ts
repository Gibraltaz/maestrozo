/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MaestrozoCore } from '@maestrozo/core';
import { MaestrozoStore } from '@maestrozo/kernel'; // FIXME import direct de core
import { MtzOperation } from "./execution";

abstract class MtzPlatformManager {

  public abstract initialize (store?: MaestrozoStore): void;

  public abstract get core(): MaestrozoCore;

  public abstract execute(what: MtzOperation|MtzOperation[]): Promise<void>;

}

export { MtzPlatformManager };
