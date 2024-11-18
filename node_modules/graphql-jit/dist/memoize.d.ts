type Fn = (...args: any[]) => any;
declare function memoize2<T extends Fn>(fn: T): T;
declare function memoize3<T extends Fn>(fn: T): T;
declare function memoize4<T extends Fn>(fn: T): T;

export { memoize2, memoize3, memoize4 };
