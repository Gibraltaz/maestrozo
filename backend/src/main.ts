/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */
import { program } from 'commander';

import { maestrozoPlatform } from 'maestrozo-platform';
import { CouchDbStore } from '@maestrozo/couchdb-store';

import { loadConfig, StoreType } from './config.js';
import { server } from './server.js';
import { MemoryStore, type MaestrozoStore } from '@maestrozo/kernel';
import { loadPluginArray } from './plugin.js';

const main = async () => {

  program
    .name('maestrozo-backend')
    .description('Maestrozo backend')
    .version('0.0.1')
    .option('-f, --config <char>', 'Configuration file path')
    .parse();
  const options = program.opts();

  let configPath = options?.config ??  './config.json';
  console.log("dOm conf", configPath);
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
      throw new Error(`Invalid store type «${config.store.type}» in «${configPath}»`);
  }

  if (store === null)
    throw new Error("Store not initialized");
  const platform = await maestrozoPlatform(store);

  await loadPluginArray(config.plugins, platform);

  await server(config, platform);
}

try {
  await main();
}
catch (error) {
  console.error(error);
}





