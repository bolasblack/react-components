export interface SimpleObj<T = string> {
  [key: string]: T
}

/** @deprecated */
export type SimpleJSON<T = string> = SimpleObj<T>

// prettier-ignore
export type AnyFunction<AS extends any[] = any[]> = (...args: AS) => any

// prettier-ignore
export type Nullable<T> =
  T extends null ? null :
  T extends undefined ? undefined :
  never
