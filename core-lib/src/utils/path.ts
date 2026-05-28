import { ElementPath } from '@/interfaces/IElement';

const pathSeparator = '/';

function elementPathAreEquals ( pathA: ElementPath, pathB: ElementPath ) : boolean {
  if (pathA.length != pathB.length)
    return false;
  for (let i = 0; i < pathA.length; i++) {
    if (pathA[i] !== pathB[i]) 
      return false;
  }
  return true;
}

function parentElementPath(path : ElementPath) : ElementPath {
  return path.slice(0, -1);
}

//function elementSegment(path : ElementPath) : ElementName | null {
//  return path.at(-1) ?? null;
//}

function pathToString(path: ElementPath) : string {
  return pathSeparator + path.join(pathSeparator);
}

export { elementPathAreEquals, parentElementPath, pathToString };
