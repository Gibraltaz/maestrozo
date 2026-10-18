import { MtzElement, ElementPath, ElementName } from '@maestrozo/kernel';
import { pathToString } from '@maestrozo/kernel';
import { MtzTree } from './Tree.js';

type GetElementFunction = (elementPath: ElementPath) => Promise<MtzElement | null>;
type GetChildFunction = (childName: ElementName) => Promise<MtzElement | null>;
type GetParentFunction = () => Promise<MtzElement | null>;
type GetPathFunction = () => ElementPath;

type MtzElementCapabilities = {
  getPath: GetPathFunction,
  getElement: GetElementFunction,
  getChild: GetChildFunction,
  getParent: GetParentFunction,
};




const buildElementCapabilities = (element: MtzElement, tree: MtzTree) : MtzElementCapabilities => {
  return {

    getPath: () => [...element.parentPath, element.elementName],

    getElement: async (elementPath: ElementPath) => tree.getElement(elementPath),

    getChild: async (childName: ElementName) => {
      const childPath = [...element.parentPath, element.elementName, childName];
      if (element.childNames === null)
        throw new Error(`Element «${pathToString([...element.parentPath, element.elementName])}» has no child`);
      if (! element.childNames.includes(childName))
        return null;
      return tree.getElement(childPath);
    },

    getParent: async () => {
      return tree.getElement(element.parentPath);
    },

  };
};

export {
  MtzElementCapabilities,
  buildElementCapabilities
}

