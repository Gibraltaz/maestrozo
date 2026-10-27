import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

import { processCommandLine } from './command.js';

const PROMPT = 'maestrozo> ';

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
