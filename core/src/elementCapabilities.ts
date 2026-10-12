import { MtzElement, ElementPath, ElementName } from "@/Element";
import { MtzEngine } from "./Engine";
import { pathToString } from "./path";
import { MESSAGE_TYPE_CHANGE, MtzMessageTime } from "./MessageQueue";

type GetElementFunction = (elementPath: ElementPath) => Promise<MtzElement | null>;
type GetChildFunction = (childName: ElementName) => Promise<MtzElement | null>;
type GetParentFunction = () => Promise<MtzElement | null>;
type GetPathFunction = () => ElementPath;
type ScheduleEvaluation = (data: any, at?: MtzMessageTime) => Promise<void>;
/*
type postMessage = (
      elementPath: ElementPath,
      messageType:MessageType,
      data: any,
      at?: MtzMessageTime
) => Promise<void>;
*/


type MtzElementCapabilities = {
  getPath: GetPathFunction,
  getElement: GetElementFunction,
  getChild: GetChildFunction,
  getParent: GetParentFunction,
  scheduleEvaluation: ScheduleEvaluation
};




const buildElementCapabilities = (element: MtzElement, engine: MtzEngine) : MtzElementCapabilities => {
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
  MtzElementCapabilities,
  buildElementCapabilities
}

