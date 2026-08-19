import { ElementName, ElementPath, rootName, } from '@/path';

// name of element «/types»
const rootTypeContainerName = 'types' as ElementName;
const rootTypeContainerPath = [ rootName, rootTypeContainerName ];

// name of element «#/types/type»
const typeElementName = 'type' as ElementName;
const typeElementPath = [ rootName, typeElementName ];

// name of element «#/types/data»
const dataTypeName = 'data' as ElementName;
const dataTypePath = [...rootTypeContainerPath, dataTypeName ];

// name of element «#/types/element»
const elementTypeName = 'element' as ElementName;
const elementTypePath = [...rootTypeContainerPath,  elementTypeName];

// name of element «#/types/container»
const containerTypeName = 'container' as ElementName;
const containerTypePath = [...rootTypeContainerPath, containerTypeName];

// name of element «#/types/pins»
const pinTypeContainerName = 'pins' as ElementName;
const pinTypeContainerPath = [...rootTypeContainerPath, pinTypeContainerName];

// name of element «#/types/pins/input-pin»
const inputPinTypeName = 'input-pin' as ElementName;
const inputPinTypePath = [...rootTypeContainerPath, pinTypeContainerName, inputPinTypeName];

// name of element «#/types/pins/output-pin»
const outputPinTypeName = 'output-pin' as ElementName;
const outputPinTypePath = [...rootTypeContainerPath, pinTypeContainerName, outputPinTypeName];

// name of element «#/types/components»
const componentTypeContainerName = 'components' as ElementName;
const componentTypeContainerPath = [...rootTypeContainerPath, componentTypeContainerName];

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
const messageQueueTypeName = 'message-queue';
const messageQueueTypePath = [...rootTypeContainerPath, messageQueueTypeName ];

// name of element «#/system/message-queue»
const messageQueueName = 'message-queue' as ElementName;

// name of element «#/types/message»
const messageTypeName = 'message';
const messageTypePath = [...rootTypeContainerPath, messageTypeName ];


export {
  rootName,
  typeElementName, typeElementPath,
  rootTypeContainerName, rootTypeContainerPath,
  dataTypeName, dataTypePath,
  elementTypeName, elementTypePath,
  containerTypeName, containerTypePath,
  componentTypeContainerName, componentTypeContainerPath,
  pinTypeContainerName, pinTypeContainerPath,
  inputPinTypeName, inputPinTypePath,
  outputPinTypeName, outputPinTypePath,
  linkTypeContainerName, linkTypeContainerPath,
  runtimeContainerName, runtimeContainerPath, 
  systemContainerName, systemContainerPath,
  messageQueueTypeName, messageQueueTypePath,
  messageQueueName,
  messageTypeName, messageTypePath
}
