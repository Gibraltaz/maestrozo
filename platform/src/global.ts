import { ElementName, ElementPath, rootName, rootTypeContainerPath } from '@maestrozo/kernel';

// element «#/types/plugin»
const pluginTypeName = 'plugin' as ElementName;
const pluginTypePath = [...rootTypeContainerPath, pluginTypeName] as ElementPath;

// element «#/types/user»
const userTypeName = 'user' as ElementName;
const userTypePath = [...rootTypeContainerPath, userTypeName] as ElementPath;

// element «#/registry»
const registryContainerName = 'registry' as ElementName;
const registryContainerPath = [...rootName, registryContainerName ] as ElementPath;

// container «#/registry/users»
const userRegistryContainerName = 'users' as ElementName;
const userRegistryContainerPath = [...registryContainerPath, userRegistryContainerName ] as ElementPath;


// element «#/platform»
const platformContainerName = 'platform' as ElementName;
const platformContainerPath = [...rootName, platformContainerName ] as ElementPath;

// element «#/platform/plugins»
const pluginContainerName = 'plugins' as ElementName;
const pluginContainerPath = [...platformContainerPath, pluginContainerName ] as ElementPath;

// element «#/platform/authenticators»
const authenticatorContainerName = 'authenticators' as ElementName;
const authenticatorContainerPath = [...platformContainerPath, authenticatorContainerName ] as ElementPath;

export {
  userTypeName, userTypePath,
  pluginTypeName, pluginTypePath,
  registryContainerName, registryContainerPath,
  userRegistryContainerName, userRegistryContainerPath,
  platformContainerName, platformContainerPath,
  pluginContainerName, pluginContainerPath,
  authenticatorContainerName, authenticatorContainerPath
};
