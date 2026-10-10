import { MtzElement, ElementPath, ElementName } from "@/Element";
import { MtzEngine } from "./Engine";
import { pathToString } from "./path";

type GetElementFunction = (elementPath: ElementPath) => Promise<MtzElement | null>;
type GetChildFunction = (childName: ElementName) => Promise<MtzElement | null>;
type GetParentFunction = () => Promise<MtzElement | null>;
type ScheduleEvaluation = (delay: number) => Promise<void>;
type GetPathFunction = () => ElementPath;

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

    scheduleEvaluation: async (_delay: number) => {
      // TODO poster un message à l'élément
      //const time = engine.timeFunction() + delay;
    }

  };
};

export {
  MtzElementCapabilities,
  buildElementCapabilities
}

