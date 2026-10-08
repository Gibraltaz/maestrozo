import { ElementName, ElementPath, pathEquals, pathToString, rootName } from "@/path";
import { TypeDeclaration } from "./TypeHandler";
import { messageTypeName, messageQueueTypeName, rootTypeContainerName, typeElementName, rootTypeContainerPath, systemContainerPath, messageQueueName } from "@/global";
import { ElementData } from "@/Element";
import { mtzMessageQueueCreate } from "@/MessageQueue";
import { BuildElementDataCallback, BuildElementDataFunction, BuildElementDataHelpers } from "./elementTypeHandler";

const buildElementDataFunction: BuildElementDataFunction = async (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>,
  _helpers: BuildElementDataHelpers
): Promise<ElementData> => {
  const value = params?.value ?? null;
  if (value === null)
    throw new Error(`Value of pin «${elementName}» of element «${pathToString(parentPath)}» is not defined`);
  return {
    value
  } as ElementData;
};

const messageTypeDeclaration: TypeDeclaration = {
  elementName: messageTypeName,
  parentPath: rootTypeContainerPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  callbacks: [
    { name: BuildElementDataCallback, function: buildElementDataFunction }
  ]
};

const messageQueueBuildDataFunction: BuildElementDataFunction = async (
  elementName: ElementName,
  parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: BuildElementDataHelpers
): Promise<ElementData> => {
  if (! pathEquals(parentPath, systemContainerPath ))
    throw new Error("Invalid parent path");
  if (elementName !== messageQueueName)
    throw new Error("Invalid name");

  const messageQueue = mtzMessageQueueCreate();
  return messageQueue  as ElementData;
};


const messageQueueTypeDeclaration: TypeDeclaration = {
  elementName: messageQueueTypeName,
  parentPath: rootTypeContainerPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  callbacks: [
    { name: BuildElementDataCallback, function: messageQueueBuildDataFunction }
  ]
};

export {
  messageTypeDeclaration,
  messageQueueTypeDeclaration
};
