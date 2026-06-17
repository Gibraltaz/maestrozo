import { ElementKind } from "@/global/types";

// les différents sortes d'éléments dans /types

// kind de : /types/data, /types/component-type
const typeElementKind : ElementKind = 'type-container' as ElementKind;

// kind de /types :
const typesRootKind : ElementKind = 'types-root' as ElementKind;


// kind dans /types :
const DataTypeElementKind : ElementKind = 'data-type' as ElementKind;


const ComponentTypeElementKind : ElementKind = 'component-type' as ElementKind;

// les différents sortes d'éléments dans /runtime
const componentKind: ElementKind = 'component' as ElementKind;
const PinConnectionTypeElementKind: ElementKind = 'pin-connection-type' as ElementKind;

const PinTypeElementKind : ElementKind = 'pin-type' as ElementKind;

// FIXME vérifier si utilisé
const inputPinTypeKind : ElementKind = 'input-pin-type' as ElementKind;
const outputPinTypeKind : ElementKind = 'output-pin-type' as ElementKind;

const inputPinKind : ElementKind = 'input-pin' as ElementKind;
const outputPinKind : ElementKind = 'output-pin' as ElementKind;

const runtimeElementKind : ElementKind = 'runtime-container' as ElementKind;
const componentContainerKind : ElementKind = 'component-container' as ElementKind;
const pinConnectionContainerKind : ElementKind = 'pin-connection-container' as ElementKind;

export {
  PinConnectionTypeElementKind,
  ComponentTypeElementKind,
  DataTypeElementKind,
  PinTypeElementKind,
  inputPinTypeKind,
  outputPinTypeKind,
  inputPinKind,
  outputPinKind,
  runtimeElementKind,
  componentContainerKind,
  pinConnectionContainerKind,
  typeElementKind,
  typesRootKind,
  componentKind
};
