import rProp from 'ramda/es/prop'

/* prettier-ignore */ export function prop<S, SK extends keyof S = keyof S>(propName: SK): (s: S) => S[SK]
/* prettier-ignore */ export function prop<S, SK extends keyof S = keyof S>(propName: SK, s: S): S[SK]
/* prettier-ignore */ export function prop(): any {
  return (rProp as any)(...arguments)
}
