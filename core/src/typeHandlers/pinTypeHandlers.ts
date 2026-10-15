import { ElementData } from 'maestrozo-kernel';
import { ElementName, ElementPath, pathToString, rootName } from 'maestrozo-kernel'

import { TypeDeclaration } from "./TypeHandler";
import { inputPinTypeName, outputPinTypeName, pinTypeContainerPath, rootTypeContainerName, typeElementName } from "../global";
import { BuildElementDataCallback, BuildElementDataFunction, BuildElementDataHelpers } from "./elementTypeHandler";

const buildElementDataFunction: BuildElementDataFunction = async (
  elementName: ElementName,
  parentPath: ElementPath,
  params:Record<string, any>,
  _helpers: BuildElementDataHelpers
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
    { name: BuildElementDataCallback, function: buildElementDataFunction }
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
    {name: BuildElementDataCallback, function: buildElementDataFunction }
  ]
};

export {
  inputPinTypeDeclaration,
  outputPinTypeDeclaration
};
