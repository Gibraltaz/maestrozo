import { ElementName, rootName, rootTypeContainerPath } from "maestrozo-kernel";

// name of element «#/types/user
const userTypeName = 'user' as ElementName;
const userTypePath = [...rootTypeContainerPath, userTypeName];

// name of element «#/registry
const registryContainerName = 'registry' as ElementName;
const registryContainerPath = [...rootName, userTypeName];

export {
  userTypeName, userTypePath,
  registryContainerName, registryContainerPath,
};
