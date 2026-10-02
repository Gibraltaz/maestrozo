import { ElementName, ElementPath, pathToString, rootName } from "@/path";
import { BuildDataFunction, BuildHelpers, TypeDeclaration } from "./TypeHandler";
import { inputPinTypeName, outputPinTypeName, pinTypeContainerPath, rootTypeContainerName, typeElementName } from "@/global";
import { ElementData } from "@/Element";
import { BuildElementDataCallback } from "./elementTypeHandler";

const buildDataFunction: BuildDataFunction = async (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>,
  _helpers: BuildHelpers
): Promise<ElementData> => {
  const value = params.value;
  // value can be null when value is unknown but it can not be undefined
  if (value === undefined)
    throw new Error(`Value of pin «${elementName}» of element «${pathToString(parentPath)}» is not defined`);
  return {
    value
  } as ElementData; 
};

const inputPinTypeDeclaration: TypeDeclaration = {
  elementName: inputPinTypeName,
  parentPath: pinTypeContainerPath as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  callbacks: [
    { name: BuildElementDataCallback, function: buildDataFunction }
  ]
};

const outputPinTypeDeclaration: TypeDeclaration = {
  elementName: outputPinTypeName,
  parentPath: pinTypeContainerPath as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: false,
  callbacks: [
    {name: BuildElementDataCallback, function: buildDataFunction }
  ]
};

export {
  inputPinTypeDeclaration,
  outputPinTypeDeclaration
};
