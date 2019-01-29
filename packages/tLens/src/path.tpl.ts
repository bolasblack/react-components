/** @file-name path.gen.ts */

import { Nullable } from '@c4605/ts-types'
import rPath from 'ramda/es/path'

/** @template-comment
<% range(1, 10).forEach(pathDepth => { -%>
<% const keyPath = range(1, pathDepth + 1).map(time => `K${time}`).join(', ') -%>
export function path<
  S,
<% range(1, pathDepth + 1).forEach(time => { -%>
  SS<%= time %> = <%- time > 1 ? `NonNullable<SS${time - 1}[K${time - 1}]>` : 'NonNullable<S>' %>,
  K<%= time %> extends keyof SS<%= time %> = keyof SS<%= time %>,
  SS<%= time %>Nullable = <%- time > 1 ? `SS${time - 1}Nullable` : 'never' %> | Nullable<SS<%= time %>[K<%= time %>]>,
<% }) -%>
  SP extends [<%= keyPath %>] = [<%= keyPath %>]
>(propPath: SP): (s: S) => SS<%= pathDepth %>Nullable | SS<%= pathDepth %>[K<%= pathDepth %>]

export function path<
  S,
<% range(1, pathDepth + 1).forEach(time => { -%>
  SS<%= time %> = <%- time > 1 ? `NonNullable<SS${time - 1}[K${time - 1}]>` : 'NonNullable<S>' %>,
  K<%= time %> extends keyof SS<%= time %> = keyof SS<%= time %>,
  SS<%= time %>Nullable = <%- time > 1 ? `SS${time - 1}Nullable` : 'never' %> | Nullable<SS<%= time %>[K<%= time %>]>,
<% }) -%>
  SP extends [<%= keyPath %>] = [<%= keyPath %>]
>(propPath: SP, s: S): SS<%= pathDepth %>Nullable | SS<%= pathDepth %>[K<%= pathDepth %>]

<% }) -%>
 */
export function path(): any {
  return (rPath as any)(...arguments)
}
