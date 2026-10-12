import * as fs from 'node:fs/promises';
import { Stats }  from 'node:fs';
import nconf from 'nconf';

type Config = {
  server: {
    port: number;
  },
  storage: {
    type: string,
    name: string,
    host: string,
    port: number,
    account: string,
    password: string
  }
};

type ConfigSectionParameterDefinition = {
  name: string,
  type: string,
  required?: boolean
};

type ConfigSectionDefinition = {
  name: string;
  parameters: Array<ConfigSectionParameterDefinition>;
};


const loadConfigSection = (configSectionDefinition: ConfigSectionDefinition, configPath: string): Record<string, any> => {
  const sectionName = configSectionDefinition.name;
  const nconfSection = nconf.get(configSectionDefinition.name);
  if (nconfSection === undefined)
    throw new Error(`Section «${sectionName}» does not exist in ${configPath}`);
  const parameters:Record<string, any> = {};

  for (const parameterDefinition of configSectionDefinition.parameters) {
    const parameterName = parameterDefinition.name;
    const parameterValue = nconfSection[parameterName];
    if (parameterValue === undefined)
        throw new Error(`Can find parameter «${parameterName}» in section «${sectionName}» of ${configPath}`);
    const parameterType = parameterDefinition.type;
    if (typeof(parameterValue) !== parameterType) 
        throw new Error(`Type of parameter «${parameterName}» is not «${parameterType}» in section «${sectionName}» of ${configPath}`);
    parameters[parameterName] = parameterValue;
  }

  return parameters;
};


const loadConfig = async(configPath: string): Promise<Config> => {

  let stat: Stats;
  try {
    stat = await fs.stat(configPath);
  }
  catch (_error) {
      throw new Error(`Can not read config file «${configPath}»`);
  }
  if (! stat.isFile())
    throw new Error(`«Config path ${configPath}» is not a file`);

  try {
    nconf.file({ file: configPath});
  }
  catch (_error) {
      throw new Error(`Can not parse JSON config file «${configPath}»`);
  }


  const serverConfig = loadConfigSection(
    {
      name: 'server', 
      parameters: [ 
        { name: 'port', type: 'number'}
      ]
    },
    configPath
  );
  const storageConfig = loadConfigSection(
    {
      name: 'storage', 
      parameters: [ 
        { name: 'type', type: 'string'},
        { name: 'name', type: 'string'},
        { name: 'host', type: 'string'},
        { name: 'port', type: 'number'},
        { name: 'account', type: 'string'},
        { name: 'password', type: 'string'},
      ]
    },
    configPath
  );

  const config: Config = {
    server: {
      port: serverConfig.port
    },
    storage: {
      type: storageConfig.type, // couchstorage or memory (selftests)
      name: storageConfig.name,
      host: storageConfig.host,
      port: storageConfig.port,
      account: storageConfig.account,
      password: storageConfig.password
    }
  }
  return config;
}

export { loadConfig };
export type { Config };
