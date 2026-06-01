import { RootElement } from '@/RootElement';
import { MessageQueueImpl } from '@/MessageQueueImpl';
import { MessageTime } from '@/interfaces/MessageQueue';
import { ElementPath, IElement } from '@/interfaces/IElement';
import { pathToString } from '@/utils/path';
import { IComponent } from './interfaces/IComponent';

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
}

export { Engine };
