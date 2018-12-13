import { Head, Tail, Prepend, Snd, Thd, DeepNonNullable, DeepRequired, DeepOptional, OptionalPropNames, RequiredPropNames, ExcludeKey, RequiredKey, OptionalKey, DeepType, DeepPick, PickNullable } from '../src/Coll'



// $ExpectType never
type HeadT1 = Head<[]>
// $ExpectType number
type HeadT2 = Head<[number]>
// $ExpectType number
type HeadT3 = Head<[number, string, boolean]>
// $ExpectType number
type HeadT4 = Head<number[]>

// $ExpectType []
type TailT1 = Tail<[number]>
// $ExpectType [string, boolean]
type TailT2 = Tail<[number, string, boolean]>
// $ExpectType number[]
type TailT3 = Tail<number[]>

// $ExpectType [string, number, boolean]
type PrependT1 = Prepend<string, [number, boolean]>
// $ExpectType [string, ...boolean[]]
type PrependT2 = Prepend<string, boolean[]>



// $ExpectType never
type SndT1 = Snd<[]>
// $ExpectType never
type SndT2 = Snd<[1]>
// $ExpectType 2
type SndT3 = Snd<[1, 2, 3]>

// $ExpectType never
type ThdT1 = Thd<[]>
// $ExpectType never
type ThdT2 = Thd<[1]>
// $ExpectType 3
type ThdT3 = Thd<[1, 2, 3]>
// $ExpectType 3
type ThdT4 = Thd<[1, 2, 3, 4]>



type DeepOptionalT1 = {a: number | null, b?: {c: string}}
// $ExpectType { a?: number | null | undefined; b?: { c?: string | undefined; } | undefined; }
type DeepOptionalT2 = DeepOptional<DeepOptionalT1>

type DeepRequiredT1 = {a?: number | null, b?: {c: string}}
// $ExpectType { a: number | null; b: { c: string; }; }
type DeepRequiredT2 = DeepRequired<DeepRequiredT1>

type DeepNonNullableT1 = {a?: number | null, b?: {c?: string | null} | null}
// $ExpectType { a: number; b: { c: string; }; }
type DeepNonNullableT2 = DeepNonNullable<DeepRequired<DeepNonNullableT1>>



type OptionalPropNamesT1 = {a?: 1 | null, b?: 2, c: 3 | null, d: 4}
// $ExpectType "a" | "b"
type OptionalPropNamesT2 = OptionalPropNames<OptionalPropNamesT1>

type RequiredPropNamesT1 = {a?: 1 | null, b?: 2, c: 3 | null, d: 4}
// $ExpectType "c" | "d"
type RequiredPropNamesT2 = RequiredPropNames<RequiredPropNamesT1>



type ExcludeKeyT1 = {a?: 1 | null, b?: 2, c: 3 | null, d: 4}
type ExcludeKeyT2 = ExcludeKey<ExcludeKeyT1, 'a' | 'd'>
// $ExpectError
type ExcludeKeyT3 = ExcludeKeyT2['a']
// $ExpectType 2 | undefined
type ExcludeKeyT4 = ExcludeKeyT2['b']
// $ExpectType 3 | null
type ExcludeKeyT5 = ExcludeKeyT2['c']
// $ExpectError
type ExcludeKeyT6 = ExcludeKeyT2['d']



type RequiredKeyT1 = {a?: number | null, b?: string | null, c?: null}

type RequiredKeyT2 = RequiredKey<{a?: number | null, b?: string | null}, 'b'>
// $ExpectType number | null | undefined
type RequiredKeyT2T1 = RequiredKeyT2['a']
// $ExpectType string
type RequiredKeyT2T2 = RequiredKeyT2['b']

type RequiredKeyT3 = RequiredKey<RequiredKeyT1, 'a' | 'c'>
// $ExpectType number
type RequiredKeyT3T1 = RequiredKeyT3['a']
// $ExpectType string | null | undefined
type RequiredKeyT3T2 = RequiredKeyT3['b']
// $ExpectType never
type RequiredKeyT3T3 = RequiredKeyT3['c']

type RequiredKeyT4 = RequiredKey<RequiredKey<RequiredKeyT1, 'a'>, 'c'>
// $ExpectType number
type RequiredKeyT4T1 = RequiredKeyT4['a']
// $ExpectType string | null | undefined
type RequiredKeyT4T2 = RequiredKeyT4['b']
// $ExpectType never
type RequiredKeyT4T3 = RequiredKeyT4['c']

type RequiredKeyT5 = RequiredKey<RequiredKey<RequiredKey<RequiredKeyT1, 'a'>, 'c'>, 'b'>
// $ExpectType number
type RequiredKeyT5T1 = RequiredKeyT5['a']
// $ExpectType string
type RequiredKeyT5T2 = RequiredKeyT5['b']
// $ExpectType never
type RequiredKeyT5T3 = RequiredKeyT5['c']

type RequiredKeyT6 = RequiredKey<RequiredKey<RequiredKeyT1, 'a' | 'c'>, 'b'>
// $ExpectType number
type RequiredKeyT6T1 = RequiredKeyT6['a']
// $ExpectType string
type RequiredKeyT6T2 = RequiredKeyT6['b']
// $ExpectType never
type RequiredKeyT6T3 = RequiredKeyT6['c']

// $ExpectError
type RequiredKeyT7 = RequiredKey<{a?: number | null, b?: string | null}, 'c'>



type OptionalKeyT1 = {a: number | null, b: string | null, c: null}

type OptionalKeyT2 = OptionalKey<{a: number | null, b: string | null}, 'b'>
// $ExpectType number | null
type OptionalKeyT2T1 = OptionalKeyT2['a']
// $ExpectType string | null | undefined
type OptionalKeyT2T2 = OptionalKeyT2['b']

type OptionalKeyT3 = OptionalKey<OptionalKeyT1, 'a' | 'c'>
// $ExpectType number | null | undefined
type OptionalKeyT3T1 = OptionalKeyT3['a']
// $ExpectType string | null
type OptionalKeyT3T2 = OptionalKeyT3['b']
// $ExpectType null | undefined
type OptionalKeyT3T3 = OptionalKeyT3['c']

type OptionalKeyT4 = OptionalKey<OptionalKey<OptionalKeyT1, 'a'>, 'c'>
// $ExpectType number | null | undefined
type OptionalKeyT4T1 = OptionalKeyT4['a']
// $ExpectType string | null
type OptionalKeyT4T2 = OptionalKeyT4['b']
// $ExpectType null | undefined
type OptionalKeyT4T3 = OptionalKeyT4['c']

type OptionalKeyT5 = OptionalKey<OptionalKey<OptionalKey<OptionalKeyT1, 'a'>, 'c'>, 'b'>
// $ExpectType number | null | undefined
type OptionalKeyT5T1 = OptionalKeyT5['a']
// $ExpectType string | null | undefined
type OptionalKeyT5T2 = OptionalKeyT5['b']
// $ExpectType null | undefined
type OptionalKeyT5T3 = OptionalKeyT5['c']

type OptionalKeyT6 = OptionalKey<OptionalKey<OptionalKeyT1, 'a' | 'c'>, 'b'>
// $ExpectType number | null | undefined
type OptionalKeyT6T1 = OptionalKeyT6['a']
// $ExpectType string | null | undefined
type OptionalKeyT6T2 = OptionalKeyT6['b']
// $ExpectType null | undefined
type OptionalKeyT6T3 = OptionalKeyT6['c']

// $ExpectError
type OptionalKeyT7 = OptionalKey<{a: number | null, b: string | null}, 'c'>



type DeepTypeT1 = {a?: number | null, b?: {c: string | null}}
// $ExpectType { a?: boolean | null | undefined; b?: { c: boolean | null; } | undefined; }
type DeepTypeT2 = DeepType<DeepTypeT1, boolean>
// $ExpectType { a?: string | boolean | null | undefined; b?: { c: string | boolean | null; } | undefined; }
type DeepTypeT3 = DeepType<DeepTypeT1, boolean | string>
// $ExpectType { a?: any; b?: { c: any; } | undefined; }
type DeepTypeT4 = DeepType<DeepTypeT1, any>



// $ExpectType never
type PickNullableT1 = PickNullable<number>
// $ExpectType null
type PickNullableT2 = PickNullable<number | null>
// $ExpectType undefined
type PickNullableT3 = PickNullable<number | undefined>
// $ExpectType null | undefined
type PickNullableT4 = PickNullable<number | null | undefined>



const DeepPickV1 = { a: true, c: { e: true, f: { g: true } } }
type DeepPickT1 = {
  a?: string | null
  b?: number | null
  c?: {
    e?: number[] | null
    f?: {
      g?: string | null
    } | null
  } | null
}
/**
 * {
 *  a?: string | null | undefined;
 *  c?: {
 *    e?: number[] | null | undefined;
 *    f?: {
 *      g?: string | null | undefined;
 *    } | null | undefined;
 *  };
 * }
 */
type DeepPickT2 = DeepPick<DeepPickT1, typeof DeepPickV1>
// $ExpectType string | null | undefined
type DeepPickT2T1 = DeepPickT2['a']
// $ExpectError
type DeepPickT2T2 = DeepPickT2['b']
// $ExpectType number[] | null | undefined
type DeepPickT2T3 = NonNullable<DeepPickT2['c']>['e']
// $ExpectType string | null | undefined
type DeepPickT2T4 = NonNullable<NonNullable<DeepPickT2['c']>['f']>['g']
