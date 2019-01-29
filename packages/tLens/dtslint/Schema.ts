export interface S {
  foo: {
    bar?: {
      x: number
    }
  }
}

export interface SF extends NonNullable<S['foo']> {}

export interface SFB extends NonNullable<S['foo']['bar']> {}

export interface A {
  0: number
  1?: ['a']
}
