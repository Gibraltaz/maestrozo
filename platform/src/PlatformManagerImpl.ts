import { MaestrozoCore, maestrozoCore } from '@maestrozo/core';
import { MaestrozoStore, rootName, ElementPath } from '@maestrozo/kernel';

import { MtzPlatformManager } from './PlatformManager.js';
import { execute as executeOp, MtzOperation } from "./execution.js";
import { 
  registryContainerName, userRegistryContainerName, registryContainerPath,
  platformContainerName, authenticatorContainerName, platformContainerPath
} from './global.js';
import { userTypeDeclaration } from './typeHandlers/userTypeHandler.js';

class MtzPlatformManagerImpl extends MtzPlatformManager  {

  private _initialized = false;
  private _core: MaestrozoCore;

  constructor (core: MaestrozoCore) {
    super();
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

    // mise en place de «#/registry/users»
    await this._core.declareContainer({
        elementName: userRegistryContainerName,
        parentPath: registryContainerPath,
        isVolatile: false
      }
    );

    // mise en place de «#/platform»
    await this._core.declareContainer({
        elementName: platformContainerName,
        parentPath: [rootName] as ElementPath,
        isVolatile: true
      }
    );

    // mise en place de «#/platform/authenticators»
    await this._core.declareContainer({
        elementName: authenticatorContainerName ,
        parentPath: platformContainerPath ,
        isVolatile: true
      }
    );

  }


  public get core(): MaestrozoCore {
    return this._core;
  }

  public async execute(what: MtzOperation|MtzOperation[]) {
    executeOp(this, what);
  }

}

export { MtzPlatformManagerImpl };
