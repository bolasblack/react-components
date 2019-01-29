import rView from 'ramda/es/view'
import { Lens } from './lens'

/* prettier-ignore */ export function view<S, UO, UI extends UO>(lens: Lens<S, UO, UI>): (s: S) => UO
/* prettier-ignore */ export function view<S, UO, UI extends UO>(lens: Lens<S, UO, UI>, s: S): UO
/* prettier-ignore */ export function view(): any {
  return (rView as any)(...arguments)
}
