/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { MaestrozoCore } from '@maestrozo/core';
import { ElementName, ElementPath, MaestrozoStore, MtzElement } from '@maestrozo/kernel'; // FIXME import direct de core
import { MtzOperation } from "./execution.js";

abstract class MtzPlatformManager {

  public abstract initialize (store?: MaestrozoStore): void;

  public abstract get core(): MaestrozoCore;

  public abstract execute(what: MtzOperation|MtzOperation[]): Promise<void>;

  public abstract createElement(
    elementName: ElementName,
    parentPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>): Promise<MtzElement>;

  public abstract modifyElement(element:MtzElement): Promise<void>;

  public abstract loadPlugin(name: ElementName, pluginPath: string): Promise<MtzElement>;

}

export { MtzPlatformManager };
