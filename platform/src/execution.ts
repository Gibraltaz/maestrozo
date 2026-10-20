import { ElementName, ElementPath, TypeDeclaration } from '@maestrozo/kernel';
import { MtzPlatformManager } from "./PlatformManager";
import { checkElementName, checkElementPath } from '@maestrozo/kernel';

enum MtzOperationType {
  TypeDeclaration = 'declare-type',
  ElementCreation = 'create-element'
};

type MtzOperation = {
  type: MtzOperationType;
};

type MtzDeclareTypeOperation = MtzOperation & {
  elementName: ElementName,
  parentPath: ElementPath,
  typePath: ElementPath,
  params: Record<string, any>,
  isContainer: boolean,
  isDerivable: boolean,
};

type MtzCreateElementOperation = MtzOperation & {
  elementName: ElementName,
  parentPath: ElementPath,
  typePath: ElementPath,
  params: Record<string, any>
};


const declareType = async (platformManager: MtzPlatformManager, operation: MtzDeclareTypeOperation) => {
  if (operation.type !== MtzOperationType.TypeDeclaration)
    throw new Error(`Operation type is not ${MtzOperationType.TypeDeclaration}`);

  checkElementName(operation.elementName, true, "Property «elementName»");
  checkElementPath(operation.parentPath, true, "Property «parentPath»");
  checkElementPath(operation.typePath, true, "Property «typePath»");

  if (operation.isDerivable === undefined)
    throw new Error(`Type declaration has no «isDerivable» property`);
  if (operation.isContainer === undefined)
    throw new Error(`Type declaration has no «isContainer» property`);


  const typeDeclaration:TypeDeclaration = {
    elementName: operation.elementName,
    parentPath: operation.parentPath,
    elementType: operation.typePath,
    isContainer: operation.isContainer,
    isDerivable: operation.isDerivable,
    isVolatile: true,
    callbacks: [] 
  };

  platformManager.core.declareType(typeDeclaration);
};

const createElement = async (platformManager: MtzPlatformManager, operation: MtzCreateElementOperation ) => {
  if (operation.type !== MtzOperationType.ElementCreation)
    throw new Error(`Operation type is not ${MtzOperationType.ElementCreation}`);

  checkElementName(operation.elementName, true, "Property «elementName»");
  checkElementPath(operation.parentPath, true, "Property «parentPath»");
  checkElementPath(operation.typePath, true, "Property «typePath»");
  
  await platformManager.core.createElement(
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
      await declareType(platformManager, operation as MtzDeclareTypeOperation);
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
  MtzOperation,
  MtzCreateElementOperation,
  MtzDeclareTypeOperation
};
