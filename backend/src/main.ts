/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { maestrozoCore } from 'maestrozo-core';
import { CouchDbStore } from 'maestrozo-couchdb-store';

import { loadConfig, StoreType } from './config.js';
import { server } from './server.js';
import { MemoryStore, type MaestrozoStore } from 'maestrozo-kernel';

const main = async () => {
  let configPath = './config.json';
  if (process.argv.length > 2)
    configPath = process.argv[2] as string;
  const config = await loadConfig(configPath);

  let store: MaestrozoStore | null = null;
  switch (config.store.type) {

    case StoreType.MEMORY:
      store = new MemoryStore();
      break;

    case StoreType.COUCH_DB:
      store = new CouchDbStore(
        config.store.host,
        config.store.port,
        config.store.user,
        config.store.password,
        config.store.database
      );
      break;

    default:
      throw new Error(`Invalid store type «${config.store.type}»`);
  }

  if (store === null)
    throw new Error("Store not initialized");
  const core = await maestrozoCore(store);
  console.log("Core version", core.version);

  await server(config);
}

try {
  await main();
}
catch (error) {
  console.error(error);
}





