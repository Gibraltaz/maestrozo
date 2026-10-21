import type { ElementName } from "@maestrozo/kernel";
import type { MaestrozoPlatform } from "../../platform/dist/platform.js";
import type { ConfigPluginDefinition } from "./config.js";

const loadPluginArray = async (pluginDefinitionArray: ConfigPluginDefinition[], platform:MaestrozoPlatform) => {
  for (const pluginDefinition of pluginDefinitionArray) {
    const pluginName = pluginDefinition.name as ElementName;
    const pluginPath = pluginDefinition.path;
    await platform.loadPlugin(pluginName, pluginPath);
  }
};

export { loadPluginArray };
