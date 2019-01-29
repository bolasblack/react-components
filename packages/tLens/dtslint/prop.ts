import { S, SF, A } from './Schema'
import { prop } from '../src/prop'

prop<S>('foo') // $ExpectType (s: S) => { bar?: { x: number; } | undefined; }
prop<S>('foo', { foo: {} }) // $ExpectType { bar?: { x: number; } | undefined; }
prop<SF>('bar') // $ExpectType (s: SF) => { x: number; } | undefined
prop<SF>('bar', {}) // $ExpectType { x: number; } | undefined
prop<A, 0>(0) // $ExpectType (s: A) => number
prop<A, 0>(0, [1, ['a']]) // $ExpectType number

prop<S>() // $ExpectError
prop<S>(undefined) // $ExpectError
prop<S>('bar') // $ExpectError
prop<S>('foo', { x: 1 }) // $ExpectError
prop<S>('foo', { bar: {} }) // $ExpectError
prop<S>('foo', {}, 1) // $ExpectError
