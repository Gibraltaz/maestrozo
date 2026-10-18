import { ElementName, ElementPath, rootName, rootTypeContainerPath, } from '@maestrozo/kernel';

const dataTypeName = 'data' as ElementName;
const dataTypePath = [...rootTypeContainerPath, dataTypeName ];

// name of element «#/types/pins»
const pinTypeContainerName = 'pins' as ElementName;
const pinTypeContainerPath = [...rootTypeContainerPath, pinTypeContainerName];

// name of element «#/types/pins/input-pin»
const inputPinTypeName = 'input-pin' as ElementName;
const inputPinTypePath = [...rootTypeContainerPath, pinTypeContainerName, inputPinTypeName];

// name of element «#/types/pins/output-pin»
const outputPinTypeName = 'output-pin' as ElementName;
const outputPinTypePath = [...rootTypeContainerPath, pinTypeContainerName, outputPinTypeName];

// name of element «#/types/component
const componentTypeName = 'component' as ElementName;
const componentTypePath = [...rootTypeContainerPath, componentTypeName];

// name of element «#/types/links»
const linkTypeContainerName = 'links' as ElementName;
const linkTypeContainerPath = [...rootTypeContainerPath, linkTypeContainerName];

// name of element «#/runtime»
const runtimeContainerName = 'runtime' as ElementName;
const runtimeContainerPath = [...rootName, runtimeContainerName] as ElementPath;

// name of element «#/system»
const systemContainerName = 'system' as ElementName;
const systemContainerPath = [...rootName, systemContainerName] as ElementPath;


// name of element «#/types/message-queue»
const messageQueueTypeName = 'message-queue' as ElementName;
const messageQueueTypePath = [...rootTypeContainerPath, messageQueueTypeName ];

// name of element «#/system/message-queue»
const messageQueueName = 'message-queue' as ElementName;
const messageQueuePath = [...systemContainerPath, messageQueueName]; 

// name of element «#/types/message»
const messageTypeName = 'message' as ElementName;
const messageTypePath = [...rootTypeContainerPath, messageTypeName ];


export {
  dataTypeName, dataTypePath,
  componentTypeName, componentTypePath,
  pinTypeContainerName, pinTypeContainerPath,
  inputPinTypeName, inputPinTypePath,
  outputPinTypeName, outputPinTypePath,
  linkTypeContainerName, linkTypeContainerPath,
  runtimeContainerName, runtimeContainerPath, 
  systemContainerName, systemContainerPath,
  messageQueueTypeName, messageQueueTypePath,
  messageQueueName, messageQueuePath,
  messageTypeName, messageTypePath
}
