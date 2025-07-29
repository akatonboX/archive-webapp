const isNumberRegex = /^([1-9]\d*|0)$/;
export type Path = {
  $toArray: () => PropertyKey[];
  $toString: () => string;
  $contains: (path: Path) => boolean;
  $equals: (path: Path) => boolean;
  $addKey: (key: PropertyKey) => Path;
};


type TypedPathDummy<T> = {
  $dummy?: T
};
export type TypedPath<T> = (
  T extends Array<infer Z>
  ? {
      [index: number]: TypedPath<Z>;
  }:
  {
    readonly [K in keyof T]-?: TypedPath<T[K] extends infer A ? A : never>;
  }
)
& {
  $isFuzzy: false;
} & Path & TypedPathDummy<T> 

class PathImpl<T> implements Path{
  currentPath: PropertyKey[];
  constructor(currentPath: PropertyKey[]){
    this.currentPath = currentPath;
  }
  $toArray() {
    return this.currentPath;
  }
  $toString(){
    const pathString = this.currentPath.reduce<string>((current, next) => {
      if(typeof next === 'number'){
        return current + "[" + next.toString() + "]";
      }
      else{
        return current + "." + next.toString();
      }
    }, "");
    return pathString[0] === "." ? pathString.substring(1) : pathString;
  }
  $contains(path: Path) {
    const targetPath = path.$toArray();
    if(this.currentPath.length > targetPath.length){
      return false;
    }
    else{
      for(var i = 0;i < this.currentPath.length;i++){
        if(this.currentPath[i] !== targetPath[i]){
          return false;
        }
      }
      return true;
    }
  }
  $equals(path: Path): boolean{
    return this.$toString() === path.$toString();
  }
  $addKey (key: PropertyKey){
    return new PathImpl([...this.currentPath, key]);
  }
}
function _path<T>(currentPath: PropertyKey[]): TypedPath<T>{
  return new Proxy(new PathImpl(currentPath) as any, {
    get: function<T>(target: T, name: PropertyKey, receiver: any): any {
      if(typeof target === 'object' &&  target !== null && name in target){
        return Reflect.get(target as any, name, receiver);
      }
      else if(name === "$isFuzzy"){
        return false;
      }
      else{
        const propertyName = ( typeof name === 'string' && isNumberRegex.test(name)) ? Number(name) : name;
        return _path([...currentPath, propertyName]);
      }
    }
  }) as TypedPath<T>;
}


export function path<T>(){
  return _path<T>([]);
}
export function pathOf<T>(obj: T){
  return _path<T>([]);
}
export function pathFrom<T>(path: string | PropertyKey[]){
  const pathArray = Array.isArray(path) ? path : path.split(/[\.\[\]]/).filter(item => item.trim().length > 0);
  return _path<T>(pathArray);
}
