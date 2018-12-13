import { AnyFunction } from './Base'

// prettier-ignore
export type Head<T extends any[]> = T extends [infer R, ...any[]] ? R : T extends (infer R)[] ? R : never

// https://github.com/Microsoft/TypeScript/pull/24897#issuecomment-400989548
// prettier-ignore
export type Tail<T extends any[]> = AnyFunction<T> extends ((h: any, ...rest: infer R) => void) ? R : never

// https://github.com/Microsoft/TypeScript/pull/24897#issuecomment-400989548
// prettier-ignore
export type Prepend<H, T extends any[]> = ((fst: H, ...args: T) => any) extends AnyFunction<infer R> ? R : []

/* TODO
// https://github.com/Microsoft/TypeScript/pull/24897#issuecomment-401401470
// prettier-ignore
export type Reverse<Tuple extends any[]> = Reverse_<Tuple, []>
type Reverse_<Tuple extends any[], Result extends any[]> = {
  1: Result,
  0: Reverse_<Tail<Tuple>, Prepend<Result, Head<Tuple>>>
}[Tuple extends [] ? 1 : 0]
type ReverseT1 = Reverse<[number, boolean]>
type ReverseT2 = Reverse<[number, boolean, string]>
type ReverseT3 = Reverse<boolean[]>

type ToTuple<T> = T extends any[] ? T : any[]
export type Concat<A extends any[], B extends any[], R = Reverse<A>, T extends any[]= ToTuple<R>> = Concat_<T, B>;
type Concat_<RA extends any[], B extends any[]> = {
  1: Reverse<RA>,
  0: Concat_<Prepend<RA, Head<B>>, Tail<B>>,
}[B extends [] ? 1 : 0];
type ConcatT1 = Concat<[1, 2, 3], [4, 5, 6]>



export type Take<N extends number, T extends any[], R extends any[]=[]> = {
  0: Reverse<R>,
  1: Take<N, Tail<T>, Cons<Head<T>, R>>
}[T extends [] ? 0 : R["length"] extends N ? 0 : 1];

export type Group<N extends number, T extends any[], R1 extends any[]=[], R2 extends any[]=[]> = {
  0: Reverse<R2>,
  1: Group<N, T, [], Cons<Reverse<R1>, R2>>,
  2: Group<N, Tail<T>, Cons<Head<T>, R1>, R2>
}[T extends [] ? R1 extends [] ? 0 : 1 : (R1["length"] extends N ? 1 : 2)];

export type Drop<N extends number, T extends any[], R extends any[]=[]> = {
  0: T,
  1: Drop<N, Tail<T>, Cons<Head<T>, R>>
}[T extends [] ? 0 : R["length"] extends N ? 0 : 1];
*/

export type Fst<T extends any[]> = Head<T>
export type Snd<T extends any[]> = Head<Tail<T>>
export type Thd<T extends any[]> = Head<Tail<Tail<T>>>

export type Car<T extends any[]> = Head<T>
export type Cdr<T extends any[]> = Tail<T>
export type Caar<T extends any[]> = Car<Car<T>>
export type Cadr<T extends any[]> = Car<Cdr<T>>
export type Cdar<T extends any[]> = Cdr<Car<T>>
export type Cddr<T extends any[]> = Cdr<Cdr<T>>



type NonNullableWithoutObject = string | boolean | number | any[] | AnyFunction

type WithoutObject = null | undefined | NonNullableWithoutObject

// prettier-ignore
export type DeepOptional<T> =
  T extends object ? { [K in keyof T]?: DeepOptional<T[K]> } :
  T

// prettier-ignore
export type DeepRequired<T> =
  T extends object ? { [K in keyof T]-?: DeepRequired<T[K]> } :
  T

// prettier-ignore
export type DeepNonNullable<T> =
  NonNullable<T> extends object ? { [K in keyof NonNullable<T>]: DeepNonNullable<NonNullable<T>[K]> } :
  NonNullable<T>

// prettier-ignore
export type OptionalPropNames<T> = NonNullable<{ [P in keyof T]: undefined extends T[P] ? P : never }[keyof T]>

// prettier-ignore
export type RequiredPropNames<T> = NonNullable<{ [P in keyof T]: undefined extends T[P] ? never : P }[keyof T]>

// prettier-ignore
export type ExcludeKey<T, EK extends keyof T> =
  { [K in Exclude<OptionalPropNames<T>, EK>]?: T[K] } &
  { [K in Exclude<keyof T, EK | OptionalPropNames<T>>]: T[K] }

// prettier-ignore
export type RequiredKey<T, Key extends keyof T> =
  { [K in keyof T]: T[K] } &
  { [K in Key]-?: NonNullable<T[K]> }

// prettier-ignore
export type OptionalKey<T, Key extends keyof T> =
  { [K in Exclude<keyof T, Key | OptionalPropNames<T>>]: T[K] } &
  { [K in Key | OptionalPropNames<T>]?: T[K] }

// prettier-ignore
export type DeepType<T, Type> =
  T extends null | undefined ? T :
  T extends WithoutObject ? Type :
  T extends object ? { [K in keyof T]: DeepType<T[K], Type> } :
  T

// prettier-ignore
export type PickNullable<T> =
  T extends null ? null :
  T extends undefined ? undefined :
  T extends null | undefined ? null | undefined :
  never

// prettier-ignore
export type DeepPick<T, U> = {
  [K in keyof U]:
    K extends keyof T ?
      U[K] extends object ? DeepPick<NonNullable<T[K]>, U[K]> | PickNullable<T[K]> : T[K]
    : never
}
