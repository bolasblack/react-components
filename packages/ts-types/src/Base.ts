export interface SimpleJSON<T = string> {
  [key: string]: T
}

// prettier-ignore
export type AnyFunction<AS extends any[] = any[]> = (...args: AS) => any
