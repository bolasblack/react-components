import rAssocPath from 'ramda/es/assocPath'

/** @file-name assocPath.gen.ts */

/** @template-comment
<% range(1, 10).forEach(pathDepth => { -%>
<% const keyPath = range(1, pathDepth + 1).map(time => `K${time}`).join(', ') -%>
export function assocPath<
  S,
<% range(1, pathDepth + 1).forEach(time => { -%>
  SS<%= time %> = <%- time > 1 ? `NonNullable<SS${time - 1}[K${time - 1}]>` : 'NonNullable<S>' %>,
  K<%= time %> extends keyof SS<%= time %> = keyof SS<%= time %>,
<% }) -%>
  SP extends [<%= keyPath %>] = [<%= keyPath %>]
>(propPath: SP): (v: <%= `SS${pathDepth}[K${pathDepth}]` %>, s: S) => S

export function assocPath<
  S,
<% range(1, pathDepth + 1).forEach(time => { -%>
  SS<%= time %> = <%- time > 1 ? `NonNullable<SS${time - 1}[K${time - 1}]>` : 'NonNullable<S>' %>,
  K<%= time %> extends keyof SS<%= time %> = keyof SS<%= time %>,
<% }) -%>
  SP extends [<%= keyPath %>] = [<%= keyPath %>]
>(propPath: SP): (v: <%= `SS${pathDepth}[K${pathDepth}]` %>) => (s: S) => S

export function assocPath<
  S,
<% range(1, pathDepth + 1).forEach(time => { -%>
  SS<%= time %> = <%- time > 1 ? `NonNullable<SS${time - 1}[K${time - 1}]>` : 'NonNullable<S>' %>,
  K<%= time %> extends keyof SS<%= time %> = keyof SS<%= time %>,
<% }) -%>
  SP extends [<%= keyPath %>] = [<%= keyPath %>]
>(propPath: SP, v: <%= `SS${pathDepth}[K${pathDepth}]` %>): (s: S) => S

export function assocPath<
  S,
<% range(1, pathDepth + 1).forEach(time => { -%>
  SS<%= time %> = <%- time > 1 ? `NonNullable<SS${time - 1}[K${time - 1}]>` : 'NonNullable<S>' %>,
  K<%= time %> extends keyof SS<%= time %> = keyof SS<%= time %>,
<% }) -%>
  SP extends [<%= keyPath %>] = [<%= keyPath %>]
>(propPath: SP, v: <%= `SS${pathDepth}[K${pathDepth}]` %>, s: S): S

<% }) -%>
 */
export function assocPath(): any {
  return (rAssocPath as any)(...arguments)
}
