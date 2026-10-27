import * as fs from 'node:fs/promises';
import os from 'node:os';
import { Stats }  from 'node:fs';
import nconf from 'nconf';

const defaultConfigPath = os.homedir() + '/.config/maestrozo/shell.json';

type Config = {
  server: {
    host: string;
    port: number;
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

type ConfigPluginDefinition = {
  name: string,
  path: string
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
    if (parameterValue === undefined) {
      const required = parameterDefinition?.required ?? true;
      if (required)
        throw new Error(`Can find parameter «${parameterName}» in section «${sectionName}» of ${configPath}`);
      else
        continue;
    }
    const parameterType = parameterDefinition.type;
    if (typeof(parameterValue) !== parameterType)
        throw new Error(`Type of parameter «${parameterName}» is not «${parameterType}» in section «${sectionName}» of ${configPath}`);
    parameters[parameterName] = parameterValue;
  }

  return parameters;
};



const loadConfig = async(configPath: string, verbose = false): Promise<Config|null> => {

  let stat: Stats;
  if (verbose)
    console.log(`Getting file info «${configPath}»…`);

  try {
    stat = await fs.stat(configPath);
  }
  catch (_error) {
    if (verbose)
      console.log(`Can not get file info «${configPath}»…`);
    return null;
  }

  if (! stat.isFile()) {
    if (verbose)
      console.log(`Config file «${configPath}» is not a file`);
    throw new Error(`«Config path ${configPath}» is not a file`);
  }

  try {
    if (verbose)
      console.log(`Reading config file «${configPath}»…`);
    nconf.file({ file: configPath});
  }
  catch (error: any) {
    if (verbose)
      console.log(`Can not read config file «${configPath}» : ${error?.message ?? error}`);
    throw new Error(`Can not parse JSON config file «${configPath}»`);
  }


  if (verbose)
    console.log(`Interpreting server section of config file…`);
  const serverConfig = loadConfigSection(
    {
      name: 'server',
      parameters: [
        { name: 'host', type: 'string'},
        { name: 'port', type: 'number'}
      ]
    },
    configPath
  );

  const config: Config = {
    server: {
      host: serverConfig.host,
      port: serverConfig.port
    },
  }

  if (verbose)
    console.log(`Configuration file successfully loaded`);
  return config;
}

export { loadConfig, defaultConfigPath };
export type { Config, ConfigPluginDefinition };
