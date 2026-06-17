import { AbstractContainer } from '@/AbstractContainer';
import { IRuntimeContainer } from '@/interfaces/IRuntimeContainer';
import { IPinConnection, IPinConnectionFactory } from '@/interfaces/IPinConnection';
import { IComponent } from '@/interfaces/IComponent';
import { IComponentFactory } from '@/interfaces/IComponentFactory';
import { parentElementPath, pathToString } from '@/utils/path';
import { ComponentName, ComponentPath, ElementName, ElementPath, InputPinName, OutputPinName } from '@/global/types';
import {  inputPinKind, outputPinKind, runtimeElementKind } from '@/global/kinds';

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
    sourceComponentName: ComponentName, sourcePinName: OutputPinName,
    targetComponentName: ComponentName, targetPinName: InputPinName,
    pinConnectionFactory: IPinConnectionFactory
  ): IPinConnection {

    // check existence of source component and source output pin
    const sourceComponent = this.getElementByName(sourceComponentName) as IComponent;
    sourceComponent.getOutputPinByName(sourcePinName);

    // check existence of target component and source input pin
    const targetComponent = this.getElementByName(targetComponentName) as IComponent;
    targetComponent.getInputPinByName(targetPinName);

    const pinConnection = pinConnectionFactory.createInstance(
      sourceComponentName, sourcePinName,
      targetComponentName, targetPinName,
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
