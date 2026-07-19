import { ElementName, rootName, } from '@/path';

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
  outputPinTypeName, outputPinTypePath
}
