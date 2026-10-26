/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { spawn, type ChildProcess } from 'node:child_process';
import { loadConfig } from '../../src/config.js';
import type { Config } from '../../src/config.js';
import { jsonGet, jsonPost } from './json-request.js';
import type { JsonRequestOptions } from './json-request.js';

const START_TIMEOUT = 5000; // ms
const CONF_FILE ='./config-test.json';

let configPath = CONF_FILE;

let backend: ChildProcess|null = null;
let testConfig: Config|null = null;
let baseUrl: string|null = null;

const sleep = (delay: number) => {
  return new Promise( resolve => setTimeout(resolve , delay));
};

const printBackendOutput = (str: string, verbose: boolean) => {
  if (verbose)
    console.log('[backend]', str); // process.stdout.write(`[backend] ${str}`);
};

const isBackendRunning = (verbose = false): boolean => {
  if (backend === null) {
    if (verbose) console.log("Backend spawn info not set");
    return false;
  }
  if (backend.exitCode !== null) {
    if (verbose) console.log("Backend exit code :", backend.exitCode);
    return false;
  }
  if (backend.killed === true) {
    if (verbose) console.log("Backend was killed");
    return false;
  }
  if (verbose) console.log("Backend is running");
  return true;
};


const terminateBackend = async (verbose = false): Promise<void> => {
  if (backend === null)
    return;

  const child = backend;
  backend = null;

  if (child.exitCode !== null || child.signalCode !== null)
    return;

  if (verbose) console.log('Stopping backend...');
  await new Promise<void>( resolve => {
    child.once('exit', () => resolve());

    if (!child.kill('SIGTERM')) {
      if (child.exitCode !== null || child.signalCode !== null)
        child.once('close', () => resolve());
    }
  });
  if (verbose) console.log('Backend terminated');
};


const startMaestrozoBackend = async(confPath?:string, verbose=false) => {
  if (verbose) console.log("Starting maestrozo backend…");

  if (backend !== null) {
    if (verbose) console.log("Backend previously started");
    throw new Error("Maestrozo backend already started");
  }

  configPath = confPath ? confPath : CONF_FILE;
  if (verbose) console.log(`Configuration file : «${configPath}»`);


  const args = [ './dist/main.js', '-f', configPath];

  if (verbose)
    args.push('--verbose');

  if (verbose)
    console.log(`Spawning «node ${args.join(' ')}»…`);

  backend = spawn(
    'node',
    args,
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  if (backend.pid === undefined) {
    if (verbose)
      console.log(`Node PID not defined`);
    await terminateBackend(verbose);
    throw new Error("Node spawn error)");
  }

  if (verbose)
    console.log(`Node successfully spawned`);
  let backendOutputBuffer = '';


  backend.stdout?.on('data', (data) => {
    const stdoutStr = data.toString();
    printBackendOutput(stdoutStr, verbose);
    backendOutputBuffer += stdoutStr;
  });

  backend.stderr?.on('data', (data) => {
    const stderrStr = data.toString();
    printBackendOutput(stderrStr, verbose);
    backendOutputBuffer += stderrStr;
  });

  const regexpSuccess = new RegExp('is listening on port');
  const regexpError = new RegExp('Error :');
  const dtMax = Date.now() + START_TIMEOUT;
  let success = null;
  let retry = 0;
  while (Date.now() < dtMax) {
    retry++;
    if (verbose)
      console.log(`Waiting backend start (retry n°${retry})`);

    if (backendOutputBuffer.match(regexpSuccess)) {
      if (verbose)
        console.log(`Backend is running`);
      success = true;
      break;
    }

    if (backendOutputBuffer.match(regexpError)) {
      if (verbose)
        console.log(`Backend error : ${backendOutputBuffer}`);
      success = false;
      break;
    }

    await sleep(500);
  }

  if (! success) {
    await terminateBackend(verbose);
    throw new Error(backendOutputBuffer);
  }

  testConfig = await loadConfig(configPath, verbose);
  if (testConfig === null) {
    if (verbose) console.log(`Configuration file «${configPath}» not loaded`);
    throw new Error("Test config not loaded");
  }

  baseUrl = `http://localhost:${testConfig.server.port}`;

  if (verbose) {
    console.log("Backend is ready");
  }
};

const stopMaestrozoBackend = async (verbose = false) => {
  if (! isBackendRunning())
    return;
  await terminateBackend(verbose);
  //await sleep(1000); // FIXME ménage
};


const backendJsonGet = async (
  url: string,
  options?:JsonRequestOptions,
  parameters?:Record<string, string>
) => {
  if (! isBackendRunning())
    throw new Error("Backend is not running");
  if (baseUrl === null)
    throw new Error("Backend base URL not set");
  const fullUrl = `${baseUrl}/${url}`;
  return await jsonGet(fullUrl, options, parameters);
};

const backendJsonPost = async (url:string , parameters: Record<string, string>, options:JsonRequestOptions={}) => {
  if (! isBackendRunning())
    throw new Error("Backend is not running");
  if (baseUrl === null)
    throw new Error("Backend base URL not set");
  const fullUrl = `${baseUrl}/${url}`;
  return await jsonPost(fullUrl, options, parameters);
}

export {
  startMaestrozoBackend, stopMaestrozoBackend, isBackendRunning,
  backendJsonGet, backendJsonPost,
  testConfig,
  sleep
};
