import { AnyFunction } from './Base'
import { Fst, Snd, Thd } from './Coll'

// prettier-ignore
export type ArgsType<T extends AnyFunction> = T extends AnyFunction<infer R> ? R : never

// prettier-ignore
export type FstArgType<F extends AnyFunction> = Fst<ArgsType<F>>

// prettier-ignore
export type SndArgType<F extends AnyFunction> = Snd<ArgsType<F>>

// prettier-ignore
export type ThdArgType<F extends AnyFunction> = Thd<ArgsType<F>>
