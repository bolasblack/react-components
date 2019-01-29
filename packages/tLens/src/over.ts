import { Lens } from './lens'
import rOver from 'ramda/es/over'

/* prettier-ignore */ export function over<S, UO, UI extends UO>(lens: Lens<S, UO, UI>): (updater: (v: UO) => UI) => (s: S) => S
/* prettier-ignore */ export function over<S, UO, UI extends UO>(lens: Lens<S, UO, UI>, updater: (v: UO) => UI): (s: S) => S
/* prettier-ignore */ export function over<S, UO, UI extends UO>(lens: Lens<S, UO, UI>): (updater: (v: UO) => UI, s: S) => S
/* prettier-ignore */ export function over<S, UO, UI extends UO>(lens: Lens<S, UO, UI>, updater: (v: UO) => UI, s: S): S
/* prettier-ignore */ export function over(): any {
  return (rOver as any)(...arguments)
}
