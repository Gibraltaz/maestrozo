/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { maestrozoCore } from "@maestrozo/core";
import { ElementPath, MaestrozoStore, MtzElement } from "@maestrozo/kernel";

import { MtzPlatformManagerImpl } from "./PlatformManagerImpl.js";

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
