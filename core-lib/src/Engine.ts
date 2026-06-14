import { RootElement } from '@/RootElement';
import { MessageQueueImpl } from '@/MessageQueueImpl';
import { pathToString } from '@/utils/path';
import { IComponent } from './interfaces/IComponent';
import { CustomComponentBuilder, EvaluateMessageFunction, PinDeclaration } from './components/CustomComponentBuilder';
import { ITypeContainer } from './interfaces/ITypeContainer';
import { ComponentTypeElement } from './ComponentTypeElement';
import { IRuntimeContainer } from './interfaces/IRuntimeContainer';
import { ITypeElement } from './interfaces/ITypeElement';
import { IComponentFactory } from './interfaces/IComponentFactory';
import { ComponentName, ElementName, ElementPath, MessageTime } from './global/types';

type TimeFunction = () => MessageTime;

class Engine {
  private _version = '0.0.1';
  private _rootElement : RootElement;
  readonly messageQueue: MessageQueueImpl;
  private _timeFunction: TimeFunction = () => Date.now() as MessageTime;

  constructor() {
      this._rootElement = new RootElement();
      this.messageQueue = new MessageQueueImpl();
  }

  get version() {
      return this._version;
  }

  getRootElement() : RootElement {
      return this._rootElement;
  }

  setTimeFunction(timeFunction: TimeFunction) {
    this._timeFunction = timeFunction;
  }

  runOnce() {
    const now = this._timeFunction();
    const message = this.messageQueue.popMessage(now);
    if (message === undefined)
      return;
    const component = this._rootElement.findElementByPath(message.componentPath) as IComponent;
    if (component === undefined)
      throw new Error(`Can not find element with path «${pathToString(message.componentPath)}»`);
    component.evaluate(message);
  }

  declareCustomComponent(
    componentTypeName: ElementName,
    typeContainerPath : ElementPath,
    inputPinDeclarations: PinDeclaration[],
    outputPinDeclarations: PinDeclaration[],
    evaluateMessageFunction: EvaluateMessageFunction
  ): ComponentTypeElement {

    const typeContainer = this._rootElement.findElementByPath(typeContainerPath) as ITypeContainer;
    if (typeContainer === undefined)
      throw new Error(`Can't find type container «${typeContainerPath}»`)

    // TODO vérifier que componentTypeContainer est bien un conteneur

    const componentBuilder = new CustomComponentBuilder(
        componentTypeName,
        inputPinDeclarations,
        outputPinDeclarations,
        typeContainer,
        evaluateMessageFunction
      );

    const componentTypeElement = typeContainer.declareComponentType(componentBuilder);

    return componentTypeElement;
  }

  createComponent(
    componentName: ComponentName,
    parentContainerPath: ElementPath,
    typePath: ElementPath,
    params: Record<string, any>
  ): IComponent {

    const runtimeContainer = this._rootElement.findElementByPath(parentContainerPath) as IRuntimeContainer;
    if (runtimeContainer === undefined) // FIXME utile si exception générée
      throw new Error(`Can't find parent container «${parentContainerPath}»`)

    const typeElement = this._rootElement.findElementByPath(typePath) as ITypeElement;
    if (typeElement === undefined) // FIXME utile si exception générée
      throw new Error(`Can't find type «${typePath}»`)

    const componentFactory = typeElement.factory as IComponentFactory;

    const component = runtimeContainer.createComponent(
      componentName,
      componentFactory,
      params
    );

    return component;
  }

}

export { Engine };
