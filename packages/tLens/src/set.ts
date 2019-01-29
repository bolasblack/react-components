import rSet from 'ramda/es/set'
import { Lens } from './lens'

/* prettier-ignore */ export function set<S, UO, UI extends UO>(lens: Lens<S, UO, UI>): (v: UI) => (s: S) => S
/* prettier-ignore */ export function set<S, UO, UI extends UO>(lens: Lens<S, UO, UI>): (v: UI, s: S) => S
/* prettier-ignore */ export function set<S, UO, UI extends UO>(lens: Lens<S, UO, UI>, v: UI): (s: S) => S
/* prettier-ignore */ export function set<S, UO, UI extends UO>(lens: Lens<S, UO, UI>, v: UI, s: S): S
/* prettier-ignore */ export function set(): any {
  return (rSet as any)(...arguments)
}
