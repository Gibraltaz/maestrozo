import { IElement, ElementName, ElementKind, ElementPath } from '@/interfaces/IElement';
import { AbstractContainer } from '@/AbstractContainer';
import { IRuntimeContainer, IComponentContainer, IPinConnectionContainer } from '@/interfaces/IRuntimeContainer';
import { IPinConnection, IPinConnectionFactory } from '@/interfaces/IPinConnection';
import { IComponent, ComponentName, InputPinName, OutputPinName } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { parentElementPath, pathToString } from '@/utils/path';

const runtimeElementKind : ElementKind = 'runtime-container' as ElementKind;

const componentContainerName : ElementName = 'components' as ElementName;
const componentContainerKind : ElementKind = 'component-container' as ElementKind;

const pinConnectionContainerName : ElementName = 'pinConnections' as ElementName;
const pinConnectionContainerKind : ElementKind = 'pin-connection-container' as ElementKind;

class ComponentContainer implements IComponentContainer {
  name: ElementName;
  kind: ElementKind;
  path: ElementPath;
  protected _children : Record<ElementName, IElement> = {};

  constructor(parentElementPath: ElementPath) {
    this.name = componentContainerName;
    this.kind = componentContainerKind;
    this.path = [ ...parentElementPath, componentContainerName ];
    this._children = {};
  }

  get children() : readonly IElement[] {
    return Object.values(this._children);
  }

  getElementByName(elementName: ElementName): IElement {
    const element = this._children[elementName];
    if (element === undefined) {
      const parentPathString = pathToString(parentElementPath(this.path));
      throw new Error(`Component «${elementName}» not found in container «${parentPathString}»`);
    }
    return element;
  }

  getComponentByName(pinName: ElementName) : IComponent{
    return this.getElementByName(pinName) as IComponent;
  }

  get components() : IComponent[] {
    return Object.values(this._children) as IComponent[];
  }

  _createComponent(
    componentName: ElementName,
    componentFactory: IComponentFactory,
    params: Record<string, any>
  ) {
    if (this._children[componentName] !== undefined) {
      const parentPathString = pathToString(parentElementPath(this.path));
      throw new Error(`A component with name «${componentName}» already exists in container «${parentPathString}»`);
    }
    const newComponent = componentFactory.createInstance(componentName, this.path, params);
    this._children[componentName] = newComponent;
    return newComponent;
  }

}

class PinConnectionContainer implements IPinConnectionContainer {
  name: ElementName;
  kind: ElementKind;
  path: ElementPath;
  protected _children : Record<ElementName, IElement> = {};

  constructor(parentElementPath: ElementPath) {
    this.name = pinConnectionContainerName ;
    this.kind = pinConnectionContainerKind ;
    this.path = [ ...parentElementPath, pinConnectionContainerName ];
    this._children = {};
  }

  get children() : readonly IElement[] {
    return Object.values(this._children);
  }

  getElementByName(elementName: ElementName): IElement {
    const element = this._children[elementName];
    if (element === undefined) {
      const parentPathString = pathToString(parentElementPath(this.path));
      throw new Error(`Pin connection «${elementName}» not found in container «${parentPathString}»`);
    }
    return element;
  }

  getPinConnectionByName(pinName: ElementName) : IPinConnection{
    return this.getElementByName(pinName) as IPinConnection;
  }

  get pinConnections() : IPinConnection[] {
    return Object.values(this._children) as IPinConnection[];
  }

  _createPinConnection(
    sourceComponentName: ComponentName, sourcePinName: OutputPinName,
    targetComponentName: ComponentName, targetPinName: InputPinName,
    pinConnectionFactory: IPinConnectionFactory
  ): IPinConnection {

    const pinConnection = pinConnectionFactory.createInstance(
      sourceComponentName, sourcePinName,
      targetComponentName, targetPinName,
      this.path
    );

    if (this._children[pinConnection.name] !== undefined) {
      const parentPathString = pathToString(parentElementPath(this.path));
      throw new Error(`Pin connection «${pinConnection.name}» already exists in container «${parentPathString}»`);
    }
    this._children[pinConnection.name] = pinConnection;

    return pinConnection;
  }

}


class RuntimeContainer extends AbstractContainer implements IRuntimeContainer {
  readonly kind = runtimeElementKind;
  readonly components: IComponentContainer;
  readonly pinConnections : IPinConnectionContainer;

  constructor(elementName: ElementName, parentElementPath: ElementPath ) {
    super(elementName, runtimeElementKind, parentElementPath);
    this.components = new ComponentContainer(this.path);
    this.pinConnections = new PinConnectionContainer(this.path);
  }

  createComponent(
    componentName: ElementName,
    componentFactory: IComponentFactory,
    params: Record<string, any>
  ): IComponent {
    const componentContainer = this.components as ComponentContainer;
    const newComponent = componentContainer._createComponent(componentName, componentFactory, params);
    return newComponent;
  } 

  createPinConnection(
    sourceComponentName: ComponentName, sourcePinName: OutputPinName,
    targetComponentName: ComponentName, targetPinName: InputPinName,
    pinConnectionFactory: IPinConnectionFactory
  ): IPinConnection {

    // check existence of source component and source output pin 
    const sourceComponent = this.components.getElementByName(sourceComponentName) as IComponent;
    sourceComponent.outputPins.getElementByName(sourcePinName);

    // check existence of target component and source input pin 
    const targetComponent = this.components.getElementByName(targetComponentName) as IComponent;
    targetComponent.inputPins.getElementByName(targetPinName);
    
    const pinConnectionsContainer = this.pinConnections as PinConnectionContainer;
    const pinConnection = pinConnectionsContainer._createPinConnection(
      sourceComponentName, sourcePinName,
      targetComponentName, targetPinName,
      pinConnectionFactory
    )

    return pinConnection;
  }

}

export { RuntimeContainer, runtimeElementKind };
