import { ElementName, ElementPath } from '@maestrozo/kernel';
import { MtzPlatformManager } from "./PlatformManager";
import { checkElementName, checkElementPath } from '@maestrozo/kernel';

enum MtzOperationType {
  TypeDeclaration = 'declare-type',
  ElementCreation = 'create-element'
};

type MtzOperation = {
  type: MtzOperationType;
};

type MtzCreateElementOperation = MtzOperation & {
  elementName: ElementName,
  parentPath: ElementPath,
  typePath: ElementPath,
  params: Record<string, any>
};

const declareType = async (_platformManager: MtzPlatformManager, operation: MtzOperation) => {
  if (operation.type !== MtzOperationType.TypeDeclaration)
    throw new Error(`Operation type is not ${MtzOperationType.TypeDeclaration}`);
  throw new Error("Declare type operation not implemented");
};

const createElement = async (platformManager: MtzPlatformManager, operation: MtzCreateElementOperation ) => {
  if (operation.type !== MtzOperationType.ElementCreation)
    throw new Error(`Operation type is not ${MtzOperationType.ElementCreation}`);

  checkElementName(operation.elementName, true, "Property «elementName»");
  checkElementPath(operation.parentPath, true, "Property «parentPath»");
  checkElementPath(operation.typePath, true, "Property «typePath»");

  
  platformManager.core.createElement(
    operation.elementName,
    operation.parentPath,
    operation.typePath,
    operation.params
  );

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
