import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { program } from 'commander';

import { processCommandLine } from './command.js';
import { defaultConfigPath, loadConfig } from './config.js';
import { shellContext } from './shell.js';

const PROMPT = 'maestrozo> ';



const main = async () => {

  program
    .name('maestrozo-shell')
    .description('Maestrozo shell')
    .version('0.0.1')
    .option('-v, --verbose',       'Verbose mode')
    .option('-f, --config <char>', 'Configuration file path')
    .option('-h, --host <char>',   'Maestrozo backend host')
    .option('-p, --port <number>', 'Maestrozo backend port')
    .parse();
  const options = program.opts();

  let verbose = options?.verbose ?? false;
  if (verbose)
    console.log("Verbose mode set");

  let configPath = options?.config ??  defaultConfigPath;
  configPath = configPath.trim();
  const config = await loadConfig(configPath, verbose);

  if (config !== null) {
    shellContext.serverHost = config.server.host,
    shellContext.serverPort = config.server.port
  }

  if (options.host !== undefined)
    shellContext.serverHost = options.host;
  if (options.port !== undefined)
    shellContext.serverPort = options.port;

  console.log("dOm context", shellContext);

  const rl = createInterface({
      input: stdin,
      output: stdout,
      prompt: PROMPT,
      historySize: 100
  });

  rl.prompt();

  for await (const line of rl) {
      const commandLine = line.trim();

      const result = await processCommandLine(commandLine);
      if (result.exit === true)
        break;

      if (result.error)
        console.log(`→ ERROR : ${result.error}`);

      rl.prompt();
  }

  rl.close();
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

