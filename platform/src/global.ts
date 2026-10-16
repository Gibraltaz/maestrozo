import { ElementName, ElementPath, rootName, rootTypeContainerPath } from "maestrozo-kernel";

// name of element «#/types/user»
const userTypeName = 'user' as ElementName;
const userTypePath = [...rootTypeContainerPath, userTypeName] as ElementPath;

// name of element «#/registry»
const registryContainerName = 'registry' as ElementName;
const registryContainerPath = [...rootName, registryContainerName ] as ElementPath;

// name of container «#/registry/users»
const userRegistryContainerName = 'users' as ElementName;
const userRegistryContainerPath = [...registryContainerPath, userRegistryContainerName ] as ElementPath;

export {
  userTypeName, userTypePath,
  registryContainerName, registryContainerPath,
  userRegistryContainerName, userRegistryContainerPath
};
