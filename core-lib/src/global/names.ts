import { ElementName } from "./types";

const PinConnectionTypeElementName: ElementName = 'pin-connection' as ElementName;
const inputPinTypeName  : ElementName = 'input-pin' as ElementName;
const outputPinTypeName : ElementName = 'output-pin' as ElementName;
const componentContainerName : ElementName = 'components' as ElementName;
const pinConnectionContainerName : ElementName = 'pinConnections' as ElementName;
const runtimeElementName : ElementName = 'runtime' as ElementName;

// /types
const typesRootName : ElementName = 'types' as ElementName;

// /types/components
const componentTypeContainerName : ElementName = 'components' as ElementName;

// /types/pins
const pinTypeContainerName : ElementName = 'pins' as ElementName;

// /types/data
const dataTypeContainerName : ElementName = 'data' as ElementName;

// /types/connections
const pinConnectionTypeContainerName : ElementName = 'connections'  as ElementName;


const componentName : ElementName = 'component' as ElementName;

export {
  ElementName,
  PinConnectionTypeElementName,
  inputPinTypeName,
  outputPinTypeName,
  componentContainerName,
  pinConnectionContainerName,
  runtimeElementName,
  componentTypeContainerName,
  typesRootName,
  dataTypeContainerName,
  pinTypeContainerName,
  componentName,
  pinConnectionTypeContainerName,
};
