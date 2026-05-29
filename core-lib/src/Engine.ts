import { RootElement } from '@/RootElement';
import { MessageQueueImpl } from '@/MessageQueueImpl';

class Engine{
    private _version = '0.0.1';
    private _rootElement : RootElement;
    readonly messageQueue: MessageQueueImpl;

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
}

export { Engine };
