import { ElementName, ElementPath } from '@maestrozo/kernel';
import { MtzPlatformManager } from "./PlatformManager";

enum MtzOperationType {
  TypeDeclaration = 'declare-type',
  ElementCreation = 'create-element'
};

type MtzOperation = {
  type: MtzOperationType;
};

type MtzCreateElementOperation = MtzOperation & {
  elementName: ElementName,
  parentPath: ElementPath
};

const declareType = async (_platformManager: MtzPlatformManager, operation: MtzOperation) => {
  if (operation.type !== MtzOperationType.TypeDeclaration)
    throw new Error(`Operation type is not ${MtzOperationType.TypeDeclaration}`);
  throw new Error("Declare type operation not implemented");
};

const createElement = async (_platformManager: MtzPlatformManager, operation: MtzCreateElementOperation ) => {
  if (operation.type !== MtzOperationType.ElementCreation)
    throw new Error(`Operation type is not ${MtzOperationType.ElementCreation}`);
  const elementName = operation.elementName;
  if (elementName === undefined)
    throw new Error("Property «elementName» is not defined in operation");
  if (typeof(elementName) !== 'string')
    throw new Error("Property «elementName» is not a string");
  throw new Error("Create element operation not implemented");
};

const executeSingleOperation = async (platformManager: MtzPlatformManager, operation: MtzOperation) => {
  const operationType = operation.type;
  if (operationType === undefined)
    throw new Error("Invalid operation");
  if (typeof(operationType) !== 'string')
    throw new Error("Invalid operation type");
  switch (operationType) {
    case MtzOperationType.TypeDeclaration:
      await declareType(platformManager, operation);
      break;
    case MtzOperationType.ElementCreation:
      await createElement(platformManager, operation as MtzCreateElementOperation);
      break;
    default:
      throw new Error(`Invalid operation type «${operationType}»`);
  }
};

const execute = async (platformManager: MtzPlatformManager, what: MtzOperation|MtzOperation[]): Promise<void> => {
  if (what instanceof Array) {
    for (const operation of what)
      await executeSingleOperation(platformManager, operation as MtzOperation);
  }
  else {
    await executeSingleOperation(platformManager, what as MtzOperation);
  }
};

export {
  execute, executeSingleOperation, 
  MtzOperationType,
  MtzOperation ,
  MtzCreateElementOperation 
};
