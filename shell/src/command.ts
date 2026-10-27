import { shellContext, type ShellContext } from './shell.js';
import { clientInit, pingBackend } from '@maestrozo/client-lib';

type CommandLineResult = {
  exit?: boolean;
  error?: string
};

type CommandFunction = (argStr: string[], context: ShellContext) => Promise<CommandLineResult>;

const helpCommand: CommandFunction = async (_argStr: string[], _context: ShellContext): Promise<CommandLineResult> => {
  console.log('Available commands :');
  commandList.forEach(commandDescriptor => {
    console.log(`  • ${commandDescriptor.name} : ${commandDescriptor.description}`);
  });
  return {} as CommandLineResult
};

const pingCommand: CommandFunction = async (_argStr: string[], context: ShellContext): Promise<CommandLineResult> => {
  const clientContext = clientInit(context.serverHost, context.serverPort);
  try {
    await pingBackend(clientContext);
    console.log(`Backend communication successful`);
    return {} as CommandLineResult
  }
  catch (err: any) {
    return { error: err?.message ?? err } as CommandLineResult
  }
};

const quitCommand: CommandFunction = async (_argStr: string[], _context: ShellContext): Promise<CommandLineResult> => {
  return { exit: true } as CommandLineResult;
};

type CommandDescriptor = {
  name: string;
  description: string;
  function: CommandFunction
};

const commandList: Array<CommandDescriptor> = [
  {
    name: 'ping',
    description: 'Test backend connection',
    function: pingCommand
  },
  {
    name: 'quit',
    description: 'Exit the shell',
    function: quitCommand
  },
  {
    name: 'help',
    description: 'Display available commands',
    function: helpCommand
  },
];

const commandTable: Record<string, CommandDescriptor> = commandList.reduce(
  (commandTable, descriptor: CommandDescriptor) => {
    return {...commandTable, [descriptor.name] : descriptor }
  },
  {} as Record<string, CommandDescriptor>
);

const processCommandLine = async (commandLine: string): Promise<CommandLineResult>  => {

  const [commandName, ...commandArgs] = commandLine.split(' ');
  if (commandName === undefined) throw new Error();  // juste to avoid typescript error
  const commandDescriptor = commandTable[commandName];
  if (commandDescriptor !== undefined)
    return await commandDescriptor.function(commandArgs, shellContext);
  else
    return { error: `Unknown command «${commandName}»` } as CommandLineResult;
};

export { processCommandLine };
export type { CommandLineResult };
