import { createRef } from 'react'
import * as React from 'react'
import { act, Simulate } from 'react-dom/test-utils'
import { Modal, useModal, ModalProps } from '../src/Modal'
import { render } from '@testing-library/react'
import user from '@testing-library/user-event'
import { renderHook } from '@testing-library/react-hooks'

const defaultProps = Modal.defaultProps!

describe('Modal', () => {
  it('basicly works', () => {
    const onVisibleChange = jest.fn()
    const portalContainerRef = createRef<HTMLElement>()

    const html = document.documentElement
    const documentElementClassNameWhenInvisible = 'Modal__html--invisible'

    const modalProps: ModalProps = {
      portalContainerRef,
      visible: false,
      onVisibleChange,
      documentElementClassNameWhenInvisible,
      children: <div className="test-modal-classname">test modal content</div>,
    }

    const modalWrapper = render(<Modal {...modalProps} />)

    // assert in initial state
    expect(portalContainerRef.current).toMatchSnapshot()
    expect(html.classList).toContain(defaultProps.documentElementClassName)
    expect(html.classList).not.toContain(
      defaultProps.documentElementClassNameWhenVisible,
    )
    expect(html.classList).toContain(documentElementClassNameWhenInvisible)

    // assert in visibie state
    modalWrapper.rerender(<Modal {...modalProps} visible={true} />)
    expect(portalContainerRef.current).toMatchSnapshot()
    expect(html.classList).toContain(defaultProps.documentElementClassName)
    expect(html.classList).toContain(
      defaultProps.documentElementClassNameWhenVisible,
    )
    expect(html.classList).not.toContain(documentElementClassNameWhenInvisible)
  })

  describe('props.backdrop', () => {
    it('support `"clickHide"`', () => {
      const portalContainerRef = createRef<HTMLElement>()
      const onVisibleChange = jest.fn()

      const modalWrapper = render(
        <Modal
          visible={false}
          onVisibleChange={onVisibleChange}
          backdrop="clickHide"
          portalContainerRef={portalContainerRef}
        />,
      )

      expect(portalContainerRef.current).toMatchSnapshot()

      act(() =>
        Simulate.click(
          modalWrapper.baseElement.querySelector(
            '.' + defaultProps.backdropClassName!,
          )!,
        ),
      )

      expect(onVisibleChange).toHaveBeenCalledTimes(1)
      expect(onVisibleChange).toHaveBeenLastCalledWith(
        false,
        expect.objectContaining({
          event: expect.objectContaining({ target: expect.anything() }),
        }),
      )
    })

    it('support `"static"`', async () => {
      const portalContainerRef = createRef<HTMLElement>()
      const onVisibleChange = jest.fn()

      const modalWrapper = render(
        <Modal
          visible={false}
          onVisibleChange={onVisibleChange}
          backdrop="static"
          portalContainerRef={portalContainerRef}
        />,
      )

      expect(portalContainerRef.current).toMatchSnapshot()

      await act(() =>
        user.click(
          modalWrapper.baseElement.querySelector(
            '.' + defaultProps.backdropClassName!,
          )!,
        ),
      )
      expect(onVisibleChange).not.toHaveBeenCalled()
    })

    it('support `false`', () => {
      const portalContainerRef = createRef<HTMLElement>()

      render(
        <Modal
          visible={false}
          onVisibleChange={jest.fn()}
          backdrop={false}
          portalContainerRef={portalContainerRef}
        />,
      )

      expect(portalContainerRef.current).toMatchSnapshot()
    })
  })
})

describe('useModal', () => {
  it('basicly works', () => {
    const onVisibleChange = jest.fn()
    const { result } = renderHook(() =>
      useModal({
        visible: true,
        onVisibleChange,
        children: () => <div>hello</div>,
      }),
    )
    const el = (): useModal.Return[0] => result.current[0]
    const ctrl = (): useModal.Return[1] => result.current[1]

    expect(el()).toMatchSnapshot()
    expect(ctrl().visible).toBe(true)
    expect(el().props.onVisibleChange).not.toBe(onVisibleChange)

    const ctrlBeforeHide = ctrl()
    act(() => ctrl().hide())
    expect(el()).toMatchSnapshot()
    expect(ctrlBeforeHide).not.toBe(ctrl)
    expect(ctrl().visible).toBe(false)

    const ctrlBeforeShow = ctrl()
    act(() => ctrl().show())
    expect(el()).toMatchSnapshot()
    expect(ctrlBeforeShow).not.toBe(ctrl)
    expect(ctrl().visible).toBe(true)
  })
})
