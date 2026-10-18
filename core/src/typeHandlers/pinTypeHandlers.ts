import {
  ElementName, ElementPath, pathToString, rootName,
  ElementData, rootTypeContainerName, typeElementName,
  TypeDeclaration, BuildElementDataCallback, 
  BuildElementDataFunction, BuildElementDataHelpers
} from 'maestrozo-kernel';

import { inputPinTypeName, outputPinTypeName, pinTypeContainerPath } from "../global.js";

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
