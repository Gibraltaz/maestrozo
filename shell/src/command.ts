type CommandLineResult = {
  exit?: boolean;
  error?: string
};

type CommandFunction = (argStr: string[]) => CommandLineResult;

const helpCommand: CommandFunction = (_argStr: string[]): CommandLineResult => {
  console.log('Available commands :');
  commandList.forEach(commandDescriptor => {
    console.log(`  • ${commandDescriptor.name} : ${commandDescriptor.description}`);
  });
  return {} as CommandLineResult
};

const quitCommand: CommandFunction = (_argStr: string[]): CommandLineResult => {
  return { exit: true } as CommandLineResult
};

type CommandDescriptor = {
  name: string;
  description: string;
  function: CommandFunction
};

const commandList: Array<CommandDescriptor> = [
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
    return commandDescriptor.function(commandArgs);
  else
    return { error: `Unknown command «${commandName}»` } as CommandLineResult;
};

export { processCommandLine };
export type { CommandLineResult };
