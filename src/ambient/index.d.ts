
type bind<T> = <R>(fn: (resVal: T) => Promise<R>) => Promise<R>;
type bindPr<E, T> = <R>(fn: (resVal: T) => Pronad<E, R>) => Pronad<E, R>;

type leftMap<T> = <E>(fn: (rejVal: E | any) => any) => Promise<T>;
type leftMapPr<E, T> = <F>(fn: (rejVal: E | any) => any) => Pronad<F, T>;

type leftBind<T> = <E>(fn: (rejVal: E | any) => Promise<T>) => Promise<T>;
type leftBindPr<E, T> = <F>(fn: (rejVal: E | any) => Pronad<F, T>) => Pronad<F, T>;

interface Promise<T> {
  map: <R>(fn: (resVal: T) => R) => Promise<R>,

  flatMap: bind<T>,
  bind: bind<T>,

  rejMap: leftMap<T>,
  // leftMap: leftMap,

  rejFlatMap: leftBind<T>,
  rejBind: leftBind<T>,
  // leftBind: leftBind,
  // leftFlatMap: leftBind,

  cata: <E, R>(rejFn: (rejVal: E | any) => R, resFn: (resVal: T) => R) => Promise<R>,

  recover: <E>(fn: (rejVal: E | any) => T) => Promise<T>, // this would just be an alias for catch, with more strict return type
  // we could write an autoRecover but unsure if we can do this with type safety to ensure that the rej type is the same as res

  // todo:
  // bimap
  // tap
  // doubleTap / biTap
  // and | or (accumulate - or is this like all/race - a bit but it doesn't collect all rejections, only the first)
}

interface PromiseConstructor {
  unit<T>(val: T): Promise<T>,
  fromFalsey<T, E>(val: T | undefined | null | false, ifFalsey?: E): Pronad<E, T>,
}

declare var Pronad: PromiseConstructor;

interface Pronad<E, T> extends Promise<T> {
  map: <R>(fn: (resVal: T) => R) => Pronad<E, R>,
  
  flatMap: bindPr<E, T>,
  bind: bindPr<E, T>,
  
  rejMap: leftMapPr<E, T>,
  // leftMap: leftMapPr<E, T>,
  
  rejFlatMap: leftBindPr<E, T>,
  rejBind: leftBindPr<E, T>,
  // leftBind: leftBindPr<E>,
  // leftFlatMap: leftBindPr<E>,
  
  cata: <R>(rejFn: (rejVal: E | any) => R, resFn: (resVal: T) => R) => Promise<R>

  recover: (fn: (rejVal: E | any) => T) => Promise<T>,
}
