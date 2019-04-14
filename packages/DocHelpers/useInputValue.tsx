import { useState, useCallback, ChangeEvent } from 'react'

export function useInputValue<S>(
  initialState: S,
  inputValueAttrName = 'value',
) {
  const [state, setState] = useState(initialState)
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setState(event.target[inputValueAttrName])
    },
    [setState],
  )
  return [state, onChange, setState] as [S, typeof onChange, typeof setState]
}
