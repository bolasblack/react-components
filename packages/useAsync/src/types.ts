export interface AsyncState$Idle {
  promise?: undefined
  loading: false
  error?: undefined
  value?: undefined
}

export interface AsyncState$Loading<T> {
  promise: Promise<T>
  loading: true
  error?: undefined
  value?: undefined
}

export interface AsyncState$Error<T> {
  promise: Promise<T>
  loading: false
  error: Error
  value?: undefined
}

export interface AsyncState$Success<T> {
  promise: Promise<T>
  loading: false
  error?: undefined
  value: T
}
