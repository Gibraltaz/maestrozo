import { RootElement } from '@/RootElement';

class Engine{
    private _version = '0.0.1';
    private _rootElement;

    constructor() {
        this._rootElement = new RootElement();
    }

    get version() {
        return this._version;
    }

    getRootElement() {
        return this._rootElement;
    }
}

export { Engine };
