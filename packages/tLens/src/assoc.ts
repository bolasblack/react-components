import rAssoc from 'ramda/es/assoc'

/* prettier-ignore */ export function assoc<S, R = S, SK extends keyof S = keyof S>(name: SK): (v: S[SK], s: S) => R
/* prettier-ignore */ export function assoc<S, R = S, SK extends keyof S = keyof S>(name: SK): (v: S[SK]) => (s: S) => R
/* prettier-ignore */ export function assoc<S, R = S, SK extends keyof S = keyof S>(name: SK, v: S[SK]): (s: S) => R
/* prettier-ignore */ export function assoc<S, R = S, SK extends keyof S = keyof S>(name: SK, v: S[SK], s: S): R
/* prettier-ignore */ export function assoc(): any {
  return (rAssoc as any)(...arguments)
}
