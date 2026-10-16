/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { maestrozoCore, MaestrozoCore } from "maestrozo-core";
import { MaestrozoStore } from "maestrozo-kernel";

import { userTypeDeclaration } from './typeHandlers/userTypeHandler';

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

    // mise en place de «#/types/data»
    /*
    await this._core.declareContainer({
      elementName: dataTypeName,
      parentPath: [rootName, rootTypeContainerName ] as ElementPath,
      isVolatile: true
    });
    */
  }


  public get core(): MaestrozoCore {
    return this._core;
  }

}

export { MtzPlatformManager };
