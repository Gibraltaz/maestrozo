type ShellContext = {
  serverHost: string;
  serverPort: number;
};

const DEFAULT_SERVER_HOST = 'localhost';
const DEFAULT_SERVER_PORT = 9101;

const shellContext: ShellContext = {
  serverHost: DEFAULT_SERVER_HOST,
  serverPort: DEFAULT_SERVER_PORT   
};

export { shellContext };
export type { ShellContext };
