import { ElementName, ElementPath, rootName } from "@/path";
import { FactoryFunction, FactoryHelpers, TypeDeclaration } from "./TypeHandler";
import { inputPinTypeName, outputPinTypeName, pinTypeContainerPath, rootTypeContainerName, typeElementName } from "@/global";
import { ElementData } from "@/Element";

const pinFactory: FactoryFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  _params:Record<string, any>,
  _helpers: FactoryHelpers
): Promise<ElementData> => {
  const data = {
  } as ElementData; 
  return data;
};

const inputPinTypeDeclaration = {
  elementName: inputPinTypeName,
  parentPath: pinTypeContainerPath as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  factory: pinFactory
} as TypeDeclaration;

const outputPinTypeDeclaration = {
  elementName: outputPinTypeName,
  parentPath: pinTypeContainerPath as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  factory: pinFactory
} as TypeDeclaration;

export {
  inputPinTypeDeclaration,
  outputPinTypeDeclaration
};
