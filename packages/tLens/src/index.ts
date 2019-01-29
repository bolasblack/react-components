import { view } from './view'
import { set } from './set'
import { over } from './over'
import { prop } from './prop'
import { assoc } from './assoc'
import { path } from './path'
import { assocPath } from './assocPath'
import { lens } from './lens'

interface Schema {
  foo: {
    bar?: {
      x: number
    }
  }
}

const fooLens0 = lens(prop<Schema>('foo'), assoc<Schema>('foo'))
const fooLens1 = lens(
  path<Schema>(['foo', 'bar', 'x']),
  assocPath<Schema>(['foo', 'bar', 'x']),
)

const schema: Schema = null as any
const res00 = view(fooLens0, schema)
const res01 = view(fooLens1, schema)
const res10 = set(fooLens0, {}, schema)
const res11 = set(fooLens1, 1, schema)
const res20 = over(fooLens0, a => ({}), schema)
const res21 = over(fooLens1, a => 1, schema)
