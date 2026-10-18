import { ElementName } from "./Element.js";

const rootName = '#' as ElementName;

const rootTypeContainerName = 'types' as ElementName;
const rootTypeContainerPath = [ rootName, rootTypeContainerName ];

const typeElementName = 'type' as ElementName;
const typeElementPath = [ rootName, typeElementName ];

// name of element «#/types/element»
const elementTypeName = 'element' as ElementName;
const elementTypePath = [...rootTypeContainerPath,  elementTypeName];

// name of element «#/types/container»
const containerTypeName = 'container' as ElementName;
const containerTypePath = [...rootTypeContainerPath, containerTypeName];

export {
  rootName,
  rootTypeContainerName, rootTypeContainerPath,
  typeElementName, typeElementPath,
  containerTypeName, containerTypePath,
  elementTypeName, elementTypePath,
};
