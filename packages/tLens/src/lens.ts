import rLens from 'ramda/es/lens'

export interface Lens<S, UO, UI> {}

/* prettier-ignore */ export function lens<S, UO, UI extends UO = UO>(getter: (s: S) => UO): (setter: (v: UI, s: S) => S) => Lens<S, UO, UI>
/* prettier-ignore */ export function lens<S, UO, UI extends UO = UO>(getter: (s: S) => UO, setter: (v: UI, s: S) => S): Lens<S, UO, UI>
/* prettier-ignore */ export function lens(): any {
  return (rLens as any)(...arguments)
}
