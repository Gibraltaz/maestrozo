import { MtzElement, ElementPath, ElementName } from 'maestrozo-kernel';
import { pathToString } from 'maestrozo-kernel';
import { MtzEngine } from './Engine';
import { MESSAGE_TYPE_CHANGE, MtzMessageTime } from './MessageQueue';

import { MtzElementCapabilities } from 'maestrozo-kernel';

type ScheduleEvaluation = (data: any, at?: MtzMessageTime) => Promise<void>;

type MtzComponentCapabilities = MtzElementCapabilities & {
  scheduleEvaluation: ScheduleEvaluation
};


const buildComponentCapabilities = (element: MtzElement, engine: MtzEngine) : MtzComponentCapabilities => {
  return {

    getPath: () => [...element.parentPath, element.elementName],

    getElement: async (elementPath: ElementPath) => engine.getElement(elementPath),

    getChild: async (childName: ElementName) => {
      const childPath = [...element.parentPath, element.elementName, childName];
      if (element.childNames === null)
        throw new Error(`Element «${pathToString([...element.parentPath, element.elementName])}» has no child`);
      if (! element.childNames.includes(childName))
        return null;
      return engine.getElement(childPath);
    },

    getParent: async () => {
      return engine.getElement(element.parentPath);
    },

    scheduleEvaluation: async (
      data: any,
      at?: MtzMessageTime
    ) => {
      const elementPath = [...element.parentPath, element.elementName] as ElementPath;
      const messageType = MESSAGE_TYPE_CHANGE;
      engine.postMessage(elementPath, messageType, data, at);
    }

    /*
    postMessage: async (
      elementPath: ElementPath,
      messageType:MessageType,
      data: any,
      at?: MtzMessageTime
    ) => {
      engine.postMessage(elementPath, messageType, data, at);
    }
    */

  };
};

export {
  MtzComponentCapabilities,
  buildComponentCapabilities
}

