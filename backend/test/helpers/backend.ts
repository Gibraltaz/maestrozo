/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { spawn, type ChildProcess } from 'node:child_process';
import { loadConfig } from '../../src/config.js';
import type { Config } from '../../src/config.js';
import { jsonGet, jsonPost } from './json-request.js';
import type { JsonRequestOptions } from './json-request.js';

const CONF_FILE ='./config-test.json';
const START_TIMEOUT = 5000; // ms

let backend: ChildProcess|null = null;
let testConfig: Config|null = null;
let baseUrl = "";

const sleep = (delay: number) => {
  return new Promise( resolve => setTimeout(resolve , delay));
};

const loadTestConfig = async () => {
  if (testConfig !== null)
    return;
  testConfig = await loadConfig(CONF_FILE);
};

const startMaestrozoBackend = async() => {
  if (backend !== null)
    throw new Error("Maestrozo backend already started");
  await loadTestConfig();
  if (testConfig === null)
    throw new Error("Test config not loaded");

  backend = spawn(
    'node',
    ['./dist/main.js', CONF_FILE],
    { stdio: 'inherit' }
  );
  if (backend.pid === undefined)
    throw new Error("Node PID not defined (Node spawn error)");

  const dtMax = Date.now() + START_TIMEOUT;
  baseUrl = `http://localhost:${testConfig.server.port}`;

  let success = false;
  while (Date.now() < dtMax) {
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) {
        success = true;
        break;
      }
    }
    catch (error:any) {
      if (error.code = 'ECONNREFUSED')
        continue;
      throw new Error(`Maestrozo backend can not be spawn : ${error.message}`);
    }
    await sleep(500);
  }
  if (! success)
    throw new Error("Maestrozo backend not started");

};

const stopMaestrozoBackend = async () => {
  if (backend === null)
    return
  console.log("stopping...");
  backend.kill();
};


const backendJsonGet = async (url: string, options?:JsonRequestOptions, parameters?:Record<string, string>) => {
  const fullUrl = `${baseUrl}/${url}`;
  return await jsonGet(fullUrl, options, parameters);
};

const backendJsonPost = async (url:string , parameters: Record<string, string>, options:JsonRequestOptions={}) => {
  const fullUrl = `${baseUrl}/${url}`;
  return await jsonPost(fullUrl, options, parameters);
}

export {
  startMaestrozoBackend, stopMaestrozoBackend,
  backendJsonGet, backendJsonPost,
  testConfig
};
