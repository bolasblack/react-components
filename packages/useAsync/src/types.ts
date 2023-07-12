export type AsyncState<T> =
  | AsyncState.Idle
  | AsyncState.Loading<T>
  | AsyncState.Success<T>
  | AsyncState.Failed<T>

export namespace AsyncState {
  export type Settled<T> = Success<T> | Failed<T>

  export interface Idle {
    readonly promise?: undefined
    readonly loading: false
    readonly error?: undefined
    readonly value?: undefined
  }

  export interface Loading<T> {
    readonly promise: Promise<T>
    readonly loading: true
    readonly error?: undefined
    readonly value?: undefined
  }

  export interface Failed<T> {
    readonly promise: Promise<T>
    readonly loading: false
    readonly error: unknown
    readonly value?: undefined
  }

  export interface Success<T> {
    readonly promise: Promise<T>
    readonly loading: false
    readonly error?: undefined
    readonly value: T
  }
}
