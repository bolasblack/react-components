import { S, SF } from './Schema'
import { assoc } from '../src/assoc'

assoc<S>('foo') // $ExpectType (v: { bar?: { x: number; } | undefined; }, s: S) => S
assoc<S>('foo', {}) // $ExpectType (s: S) => S
assoc<S>('foo', { bar: undefined }) // $ExpectType (s: S) => S
assoc<S>('foo', { bar: { x: 1 } }) // $ExpectType (s: S) => S
assoc<S>('foo', {}, { foo: {} }) // $ExpectType S
assoc<S>('foo', { bar: undefined }, { foo: {} }) // $ExpectType S
assoc<S>('foo', { bar: { x: 1 } }, { foo: {} }) // $ExpectType S
assoc<SF>('bar', undefined) // $ExpectType (s: SF) => SF
assoc<SF>('bar', undefined, {}) // $ExpectType SF
assoc<SF>('bar', { x: 2 }) // $ExpectType (s: SF) => SF
assoc<SF>('bar', { x: 2 }, {}) // $ExpectType SF

assoc<S>() // $ExpectError
assoc<S>(undefined) // $ExpectError
assoc<S>('bar') // $ExpectError
assoc<S>('foo', { x: 1 }) // $ExpectError
assoc<S>('foo', { bar: {} }) // $ExpectError
assoc<S>('foo', {}, 1) // $ExpectError
assoc<SF>('bar', {}) // $ExpectError
