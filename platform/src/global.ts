import { ElementName, rootTypeContainerPath } from "maestrozo-kernel";

// name of element «#/types/user
const userTypeName = 'user' as ElementName;
const userTypePath = [...rootTypeContainerPath, userTypeName];

export {
  userTypeName, userTypePath 
};
