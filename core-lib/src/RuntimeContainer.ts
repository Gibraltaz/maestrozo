import { AbstractContainer } from '@/AbstractContainer';
import { IRuntimeContainer } from '@/interfaces/IRuntimeContainer';
import { IPinConnection, IPinConnectionFactory } from '@/interfaces/IPinConnection';
import { IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { parentElementPath, pathToString } from '@/utils/path';
import { ComponentName, ComponentPath, ElementName, ElementPath } from '@/global/types';
import { runtimeElementKind } from '@/global/kinds';
import { InputPin, OutputPin } from './Pin';

class RuntimeContainer extends AbstractContainer implements IRuntimeContainer {
  readonly kind = runtimeElementKind;

  constructor(elementName: ElementName, parentElementPath: ElementPath ) {
    super(elementName, runtimeElementKind, parentElementPath);
  }

  createComponent(
    componentName: ElementName,
    componentFactory: IComponentFactory,
    params: Record<string, any>
  ): IComponent {
    if (this._children[componentName] !== undefined) {
      const parentPathString = pathToString(parentElementPath(this.path));
      throw new Error(`A component with name «${componentName}» already exists in container «${parentPathString}»`);
    }
    const newComponent = componentFactory.createInstance(componentName, this.path, params);
    this._children[componentName] = newComponent;
    return newComponent;

  }

  createPinConnection(
    sourceComponent: IComponent, sourcePin: OutputPin,
    targetComponent: IComponent, targetPin: InputPin,
    pinConnectionFactory: IPinConnectionFactory
  ): IPinConnection {

    const pinConnection = pinConnectionFactory.createInstance(
      sourceComponent, sourcePin,
      targetComponent, targetPin,
      this.path
    );

    if (this._children[pinConnection.name] !== undefined) {
      const pathString = pathToString(this.path);
      throw new Error(`Pin connection «${pinConnection.name}» already exists in container «${pathString}»`);
    }
    this._children[pinConnection.name] = pinConnection;

    return pinConnection;
  }

  getComponentByName(componentName: ComponentName): IComponent {
    const component: IComponent = this.getElementByName(componentName) as IComponent;
    return component;
  }

  getComponentByPath(componentPath: ComponentPath): IComponent | undefined {
    const component: IComponent = this.findElementByPath(componentPath) as IComponent;
    return component;
  }

}

export { RuntimeContainer };
