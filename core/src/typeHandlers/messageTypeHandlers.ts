import { ElementName, ElementPath, pathEquals, pathToString, rootName } from "@/path";
import { BuildDataFunction, BuildHelpers, TypeDeclaration } from "./TypeHandler";
import { messageTypeName, messageQueueTypeName, rootTypeContainerName, typeElementName, rootTypeContainerPath, systemContainerPath, systemContainerName, messageQueueName } from "@/global";
import { ElementData } from "@/Element";

const messageBuildDataFunction: BuildDataFunction = async (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>,
  _helpers: BuildHelpers
): Promise<ElementData> => {
  const value = params?.value ?? null;
  if (value === null)
    throw new Error(`Value of pin «${elementName}» of element «${pathToString(parentPath)}» is not defined`);
  return {
    value
  } as ElementData; 
};

const messageTypeDeclaration = {
  elementName: messageTypeName,
  parentPath: rootTypeContainerPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  buildDataFunction: messageBuildDataFunction
} as TypeDeclaration;

const messageQueueBuildDataFunction: BuildDataFunction = async (
  elementName: ElementName,
  parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildHelpers
): Promise<ElementData> => {
  if (! pathEquals(parentPath, systemContainerPath ))
    throw new Error("Invalid parent path");
  if (elementName !== messageQueueName)
    throw new Error("Invalid name");


  return {
  } as ElementData; 
};


const messageQueueTypeDeclaration = {
  elementName: messageQueueTypeName,
  parentPath: rootTypeContainerPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  buildDataFunction: messageQueueBuildDataFunction,
  buildElementFunction: null
} as TypeDeclaration;

export {
  messageTypeDeclaration,
  messageQueueTypeDeclaration
};
