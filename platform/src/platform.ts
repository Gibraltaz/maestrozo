/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { maestrozoCore } from "@maestrozo/core";
import { ElementName, ElementPath, MaestrozoStore, MtzElement } from "@maestrozo/kernel";

import { MtzPlatformManagerImpl } from "./PlatformManagerImpl.js";
import { MtzOperation } from "./execution.js";

const VERSION = '0.0.1';

type MaestrozoUserServiceRegisterFunction = (email: string) => Promise<MtzElement>;

type MeaestrozoUserService = {
  register: MaestrozoUserServiceRegisterFunction 
};

//type MeaestrozoTeamService = any;
//type MeaestrozoOrganizationService = any;
//type MeaestrozoOfferService = any;
//type MeaestrozoRequestService = any;
//type MeaestrozoFormService = any;


type MaestrozoPlatform = {
  version: string,
  getElement: (elementPath: ElementPath) => Promise<MtzElement|null>;
  execute: (what: MtzOperation|MtzOperation[]) => Promise<void>,
  loadPlugin: (name: ElementName, pluginPath: string) => Promise<MtzElement>,
  runOnce: () => Promise<void>, 
  user: MeaestrozoUserService,
  //organization: MeaestrozoOrganizationService,
  //team: MeaestrozoTeamService,
  //offer: MeaestrozoOfferService,
  //request: MaestrozoRequestService,
  //form: MaestrozoFormService
};

const maestrozoPlatform = async (store?: MaestrozoStore) : Promise<MaestrozoPlatform> => {

  const core = await maestrozoCore(store);

  const platformManager = new MtzPlatformManagerImpl(core);
  await platformManager.initialize();

  return {
    version: VERSION,
    runOnce: async () => await core.runOnce(),
    getElement: async (elementPath: ElementPath) => await core.getElement(elementPath),
    loadPlugin: async (name: ElementName, pluginPath: string) => await platformManager.loadPlugin(name, pluginPath),
    execute: async (what: MtzOperation|MtzOperation[]) => await platformManager.execute(what),
    user: {
      register: async (_email: string) => {
        return {} as MtzElement;
      }
    },

    //organization: {
    //},
    //
    //team: {
    //},
    //
    //offer: {
    //},
    //
    //request: {
    //},
    //
    //form: {
    //},
  };
};


export { maestrozoPlatform };
export type { MaestrozoPlatform };
