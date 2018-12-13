import { ArgsType } from '../src/Fn'



// $ExpectType []
type ArgsTypeT1 = ArgsType<() => void>
// $ExpectType [1]
type ArgsTypeT2 = ArgsType<(a: 1) => void>
// $ExpectType [1, 2]
type ArgsTypeT3 = ArgsType<(a: 1, c: 2) => void>
// $ExpectType [1, 2, ...boolean[]]
type ArgsTypeT4 = ArgsType<(a: 1, c: 2, ...args: boolean[]) => void>
// $ExpectError
const argsTypeV2: ArgsType<(a: 1, b: 2) => void> = [1, 3]
