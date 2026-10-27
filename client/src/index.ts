import { jsonGet } from './json-request.js';

type ClientContext = {
  serverHost: string,
  serverPort: number
};


const clientInit = (serverHost: string, serverPort: number): ClientContext => {
  return {
    serverHost,
    serverPort
  }
};

const pingBackend = async (context:ClientContext): Promise<void> => {
  const url = `http://${context.serverHost}:${context.serverPort}/`;
  let response;
  try {
    response = await jsonGet(url);
  }
  catch (err: any) {
    throw new Error("Can not communicate with backend"); 
  }
  if (response.name === undefined || response.description === undefined)
      throw new Error("Invalid backend response");
};

export { clientInit, pingBackend };
export type { ClientContext };
