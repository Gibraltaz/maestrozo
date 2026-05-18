import { ElementName, ElementPath } from '@/interfaces/IElement';
import { RuntimeContainer } from '@/RuntimeContainer';

const runtimeElementName : ElementName = 'runtime' as ElementName;
const componentTypeName : ElementName = 'component' as ElementName;

class RuntimeRoot extends RuntimeContainer {

  constructor() {
    super(runtimeElementName, [] as ElementPath);
  }

}

export {
    RuntimeRoot,
    runtimeElementName,
    componentTypeName,
};
