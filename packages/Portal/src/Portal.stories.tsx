import * as React from 'react'
import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { DocumentElement } from '@c4605/react-document-element'
import { OnVisibleChangeCallback, Portal } from './Portal'

export default {
  title: 'Components/Portal',
  component: Portal,
} satisfies Meta<typeof Portal>

export const BasicUsage: StoryFn = () => {
  const triggerContentRef = useRef<HTMLButtonElement>(null)
  const portalContentRef = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState(false)

  const [renderInline, setRenderInline] = useInputValue(false, 'checked')

  const [closeOnClick, setCloseOnClick] = useInputValue(false, 'checked')

  const [closeOnOutsideClick, setCloseOnOutsideClick] = useInputValue(
    false,
    'checked',
  )

  const onVisibleChange: OnVisibleChangeCallback = (
    visible,
    { event },
  ): void => {
    if (event == null) return
    if (!(event.target instanceof HTMLElement)) return
    if (!triggerContentRef.current) return
    if (!portalContentRef.current) return

    if (visible) {
      setVisible(true)
    } else if (
      (closeOnClick && portalContentRef.current.contains(event.target)) ||
      (closeOnOutsideClick &&
        !triggerContentRef.current.contains(event.target) &&
        !portalContentRef.current.contains(event.target))
    ) {
      setVisible(false)
    }
  }

  return (
    <div>
      <p>
        <label>
          renderInline
          <input
            type="checkbox"
            checked={renderInline}
            onChange={setRenderInline}
          />
        </label>
      </p>
      <p>
        <label>
          closeOnClick
          <input
            type="checkbox"
            checked={closeOnClick}
            onChange={setCloseOnClick}
          />
        </label>
      </p>
      <p>
        <label>
          closeOnOutsideClick
          <input
            type="checkbox"
            checked={closeOnOutsideClick}
            onChange={setCloseOnOutsideClick}
          />
        </label>
      </p>
      <p>
        <button
          ref={triggerContentRef}
          type="button"
          onClick={() => setVisible(true)}
        >
          Show Portal
        </button>
      </p>
      <DocumentElement style={visible ? { overflow: 'hidden' } : {}} />
      <Portal
        parent={renderInline ? null : undefined}
        visible={visible}
        onVisibleChange={onVisibleChange}
      >
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: '#00000050',
          }}
        >
          <div
            ref={portalContentRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '300px',
              minHeight: '300px',
              background: '#fff',
            }}
          >
            <p>Portal content</p>
            <p>
              <button type="button" onClick={() => setVisible(false)}>
                Close Portal
              </button>
            </p>
          </div>
        </div>
      </Portal>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useInputValue<S>(initialState: S, inputValueAttrName = 'value') {
  const [state, setState] = useState(initialState)
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setState((event.target as any)[inputValueAttrName])
    },
    [inputValueAttrName],
  )
  return [state, onChange, setState] as [S, typeof onChange, typeof setState]
}
