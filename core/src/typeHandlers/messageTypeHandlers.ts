import { ElementName, ElementPath, pathToString, rootName } from "@/path";
import { BuildDataFunction, BuildHelpers, TypeDeclaration } from "./TypeHandler";
import { messageTypeName, messageQueueTypeName, rootTypeContainerName, typeElementName, rootTypeContainerPath } from "@/global";
import { ElementData } from "@/Element";

const buildDataFunction: BuildDataFunction = async (
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
  buildDataFunction: buildDataFunction
} as TypeDeclaration;

const messageQueueTypeDeclaration = {
  elementName: messageQueueTypeName,
  parentPath: rootTypeContainerPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  buildDataFunction: buildDataFunction,
  buildElementFunction: null
} as TypeDeclaration;

export {
  messageTypeDeclaration,
  messageQueueTypeDeclaration
};
