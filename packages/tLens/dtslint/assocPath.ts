import { S } from './Schema'
import { assocPath } from '../src/assocPath'

assocPath<S>(['foo']) // $ExpectType (v: { bar?: { x: number; } | undefined; }, s: S) => S
assocPath<S>(['foo'], {}) // $ExpectType (s: S) => S
assocPath<S>(['foo'], {}, { foo: {} }) // $ExpectType S
assocPath<S>(['foo', 'bar']) // $ExpectType (v: { x: number; } | undefined, s: S) => S
assocPath<S>(['foo', 'bar'], undefined) // $ExpectType (s: S) => S
assocPath<S>(['foo', 'bar'], { x: 1 }) // $ExpectType (s: S) => S
assocPath<S>(['foo', 'bar'], undefined, { foo: {} }) // $ExpectType S
assocPath<S>(['foo', 'bar'], { x: 2 }, { foo: {} }) // $ExpectType S
assocPath<S>(['foo', 'bar', 'x']) // $ExpectType (v: number, s: S) => S
assocPath<S>(['foo', 'bar', 'x'], 1) // $ExpectType (s: S) => S
assocPath<S>(['foo', 'bar', 'x'], 1, { foo: {} }) // $ExpectType S

assocPath<S>() // $ExpectError
assocPath<S>(undefined) // $ExpectError
assocPath<S>([]) // $ExpectError
assocPath<S>(['bar']) // $ExpectError
assocPath<S>(['foo'], undefined) // $ExpectError
assocPath<S>(['foo'], { bar: {} }) // $ExpectError
assocPath<S>(['foo', 'bar'], {}) // $ExpectError
assocPath<S>(['foo', 'bar', 'x'], undefined) // $ExpectError
assocPath<S>(['foo', 'bar', 'x'], {}) // $ExpectError
