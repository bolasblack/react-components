import { render, renderHook } from '@testing-library/react'
import user from '@testing-library/user-event'
import * as React from 'react'
import { act, createRef } from 'react'
import { vi } from 'vitest'
import { Modal, ModalProps, defaultProps, useModal } from './Modal'

describe('Modal', () => {
  it('basicly works', () => {
    const onVisibleChange = vi.fn()
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
    expect(html.classList).not.toContain(defaultProps.documentElementClassNameWhenVisible)
    expect(html.classList).toContain(documentElementClassNameWhenInvisible)

    // assert in visibie state
    modalWrapper.rerender(<Modal {...modalProps} visible={true} />)
    expect(portalContainerRef.current).toMatchSnapshot()
    expect(html.classList).toContain(defaultProps.documentElementClassName)
    expect(html.classList).toContain(defaultProps.documentElementClassNameWhenVisible)
    expect(html.classList).not.toContain(documentElementClassNameWhenInvisible)
  })

  describe('props.backdrop', () => {
    it('support `"clickHide"`', async () => {
      const portalContainerRef = createRef<HTMLElement>()
      const onVisibleChange = vi.fn()

      const modalWrapper = render(
        <Modal
          visible={false}
          onVisibleChange={onVisibleChange}
          backdrop="clickHide"
          portalContainerRef={portalContainerRef}
        />,
      )

      expect(portalContainerRef.current).toMatchSnapshot()

      await user.click(
        modalWrapper.baseElement.querySelector('.' + defaultProps.backdropClassName!)!,
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
      const onVisibleChange = vi.fn()

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
        user.click(modalWrapper.baseElement.querySelector('.' + defaultProps.backdropClassName!)!),
      )
      expect(onVisibleChange).not.toHaveBeenCalled()
    })

    it('support `false`', () => {
      const portalContainerRef = createRef<HTMLElement>()

      render(
        <Modal
          visible={false}
          onVisibleChange={vi.fn()}
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
    const onVisibleChange = vi.fn()
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
