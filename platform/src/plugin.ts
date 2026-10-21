import { resolve } from 'node:path';
import { stat } from 'node:fs/promises';
import { Stats }  from 'node:fs';

import type { ElementName, MtzElement } from "@maestrozo/kernel";
import { MtzPlatformManager } from "./PlatformManager.js";
import { pluginContainerPath, pluginTypePath } from './global.js';
import { PluginStatus } from './typeHandlers/pluginTypeHandler.js';

interface MtzPluginModule {
  initialize(): Promise<void>
};

const loadPlugin = async (pluginName: ElementName, pluginPath: string, platform: MtzPlatformManager): Promise<MtzElement> => {

  // TODO vérifier qu'il n'existe pas déjà un plugin avec le même nom

  if (pluginName === undefined)
    throw new Error("Plugin name not defined in plugin definition");
  if (typeof(pluginName) !== 'string')
    throw new Error("Plugin name is not a string in plugin definition");

  if (pluginPath === undefined)
    throw new Error("Plugin path not defined in plugin definition");
  if (typeof(pluginPath) !== 'string')
    throw new Error("Plugin path is not a string in plugin definition");

  let absolutePluginPath:string|null = null;
  let fstat: Stats;
  try {
    absolutePluginPath = resolve(pluginPath);
    fstat = await stat(absolutePluginPath);
  }
  catch (_error) {
      throw new Error(`Can not read plugin file «${absolutePluginPath}»`);
  }
  if (! fstat.isFile())
    throw new Error(`«Plugin path ${absolutePluginPath}» is not a file`);

  let plugin: MtzPluginModule|null = null;
  try {
    plugin = await import(absolutePluginPath);
  }
  catch (error: any) {
      throw new Error(`Can not load plugin «${absolutePluginPath}» : ${error?.message ?? error}`);
  }
  if (plugin === null)
    throw new Error("Plugin not loaded"); // just to avoid warning

  const pluginElement = await platform.createElement(pluginName, pluginContainerPath, pluginTypePath, {
    pluginPath : absolutePluginPath
  });

  if (plugin.initialize === undefined)
    throw new Error(`Plugin initialize function is not defined in ${absolutePluginPath}`);

  try {
    await plugin.initialize();
  }
  catch (error: any) {
      throw new Error(`Can call initialize function of plugin «${absolutePluginPath}» : ${error?.message ?? error}`);
  }

  if (pluginElement === null) throw new Error("Plugin element is null");
  if (pluginElement.data === null) throw new Error("Plugin element data is null");

  pluginElement.data.status = PluginStatus.loaded;
  pluginElement.revision++;
  await platform.modifyElement(pluginElement);

  return pluginElement;
};

export { loadPlugin };
