/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { maestrozoCore, FileStore } from 'maestrozo-core';
import { loadConfig } from './config.js';
import { server } from './server.js';

const main = async () => {
  const fileStore = new FileStore('/tmp/maestrozo.tmp');
  await fileStore.initialize();
  console.log(fileStore);
  const core = await maestrozoCore(fileStore);
  console.log("Core version", core.version);
  let configPath = './config.json';
  if (process.argv.length > 2)
    configPath = process.argv[2] as string;
  const config = await loadConfig(configPath);
  await server(config);
}

try {
  await main();
}
catch (error) {
  console.error(error);
}





