import { RootElement } from '@/RootElement';
import { MessageQueueImpl } from '@/MessageQueueImpl';
import { MessageTime } from '@/interfaces/MessageQueue';
import { ElementName, ElementPath, IElement } from '@/interfaces/IElement';
import { pathToString } from '@/utils/path';
import { ComponentName, IComponent } from './interfaces/IComponent';
import { CustomComponentBuilder, EvaluateMessageFunction, PinDeclaration } from './components/CustomComponentBuilder';
import { ITypeContainer } from './interfaces/ITypeContainer';
import { ITypeElement } from './interfaces/ITypeElement';
import { ComponentTypeElement } from './ComponentTypeElement';

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
    _componentName: ComponentName,
    _componentTypePath: ElementPath,
    _params: Record<string, any>
  ): ElementPath {
    throw new Error("Engine.createComponent ot yet implemented");
  }

}

export { Engine };
