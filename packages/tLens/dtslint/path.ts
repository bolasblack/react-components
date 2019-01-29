import { S, A } from './Schema'
import { path } from '../src/path'

path<S>(['foo']) // $ExpectType (s: S) => { bar?: { x: number; } | undefined; }
path<S>(['foo'], { foo: {} }) // $ExpectType { bar?: { x: number; } | undefined; }
path<S>(['foo', 'bar']) // $ExpectType (s: S) => { x: number; } | undefined
path<S>(['foo', 'bar'], { foo: {} }) // $ExpectType { x: number; } | undefined
path<S>(['foo', 'bar', 'x']) // $ExpectType (s: S) => number | undefined
path<S>(['foo', 'bar', 'x'], { foo: {} }) // $ExpectType number | undefined
path<A>([1, 0]) // $ExpectType (s: A) => number
path<A, 0>(0, [1, ['a']]) // $ExpectType number

path<S>() // $ExpectError
path<S>(undefined) // $ExpectError
path<S>([]) // $ExpectError
path<S>(['bar']) // $ExpectError
path<S>(['foo'], 1) // $ExpectError
path<S>(['foo'], { bar: {} }) // $ExpectError
path<S>(['foo', 'bar'], {}) // $ExpectError
path<S>(['foo', 'bar', 'x'], undefined) // $ExpectError
path<S>(['foo', 'bar', 'x'], {}) // $ExpectError
