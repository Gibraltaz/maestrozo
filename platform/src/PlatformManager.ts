/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { maestrozoCore, MaestrozoCore, rootName } from "maestrozo-core";
import { ElementPath, MaestrozoStore } from "maestrozo-kernel"; // FIXME import direct de core

import { userTypeDeclaration } from './typeHandlers/userTypeHandler';
import { registryContainerName } from "./global";

class MtzPlatformManager {

  private _initialized = false;
  private _core: MaestrozoCore;

  constructor (core: MaestrozoCore) {
    this._core = core;
  }

  public async initialize (store?: MaestrozoStore) {
    assert(this._core !== null);
    if (this._initialized)
      throw new Error("Maestrozo Plantform already initialized");

    // cas des auto-tests qui n'ont pas passé de kernel
    if (store !== undefined) {
      if (this._core !== null)
        throw new Error("Maestrozo Plantform already initialized");
      this._core = await maestrozoCore(store);
    }

    // mise en place de «#/types/users»
    await this._core.declareType(userTypeDeclaration);

    // mise en place de «#/registry»
    await this._core.declareContainer({
        elementName: registryContainerName,
        parentPath: [rootName] as ElementPath,
        isVolatile: false
      }
    );


  }


  public get core(): MaestrozoCore {
    return this._core;
  }

}

export { MtzPlatformManager };
