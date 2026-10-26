/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */
import { program } from 'commander';

import { maestrozoPlatform } from 'maestrozo-platform';
import { CouchDbStore } from '@maestrozo/couchdb-store';

import { loadConfig, StoreType } from './config.js';
import { startServer } from './server.js';
import { MemoryStore, type MaestrozoStore } from '@maestrozo/kernel';
import { loadPluginArray } from './plugin.js';

const main = async () => {

  program
    .name('maestrozo-backend')
    .description('Maestrozo backend')
    .version('0.0.1')
    .option('-v, --verbose',       'Verbose mode')
    .option('-f, --config <char>', 'Configuration file path')
    .parse();
  const options = program.opts();

  let verbose = options?.verbose ?? false;
  if (verbose)
    console.log("Verbose mode set");

  let configPath = options?.config ??  './config.json';
  configPath = configPath.trim();
  const config = await loadConfig(configPath, verbose);

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

  await startServer(config, platform);
}

try {
  await main();
}
catch (error: unknown) {
  console.log(
    'Error :',
    error instanceof Error ? error.message : error
  );
  process.exitCode = 2;
}
