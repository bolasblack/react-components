import { createRef } from 'react'
import * as React from 'react'
import { act } from 'react-dom/test-utils'
import { Portal } from '@c4605/react-portal'
import { Modal, useModal } from '../src/Modal'
import { mount, shallow } from 'enzyme'

const defaultProps = Modal.defaultProps!

describe('Modal', () => {
  it('basicly works', () => {
    const onVisibleChange = jest.fn()
    const portalRef = createRef<Portal>()
    const html = document.documentElement
    const documentElementClassNameWhenInvisible = 'Modal__html--invisible'

    const modalWrapper = mount(
      <Modal
        visible={false}
        onVisibleChange={onVisibleChange}
        portalRef={portalRef}
        documentElementClassNameWhenInvisible={
          documentElementClassNameWhenInvisible
        }
      >
        <div className="test-modal-classname">test modal content</div>
      </Modal>,
    )

    // assert in initial state
    expect(portalRef.current).toBeInstanceOf(Portal)
    const portal = portalRef.current!
    expect(portal.portal).toMatchSnapshot()
    expect(html.classList).toContain(defaultProps.documentElementClassName)
    expect(html.classList).not.toContain(
      defaultProps.documentElementClassNameWhenVisible,
    )
    expect(html.classList).toContain(documentElementClassNameWhenInvisible)

    // assert in visibie state
    modalWrapper.setProps({ visible: true })
    expect(portal.portal).toMatchSnapshot()
    expect(html.classList).toContain(defaultProps.documentElementClassName)
    expect(html.classList).toContain(
      defaultProps.documentElementClassNameWhenVisible,
    )
    expect(html.classList).not.toContain(documentElementClassNameWhenInvisible)
  })

  describe('props.backdrop', () => {
    it('support `"clickHide"`', () => {
      const portalRef = createRef<Portal>()
      const onVisibleChange = jest.fn()

      const modalWrapper = mount(
        <Modal
          visible={false}
          onVisibleChange={onVisibleChange}
          backdrop="clickHide"
          portalRef={portalRef}
        />,
      )

      expect(portalRef.current!.portal).toMatchSnapshot()

      modalWrapper.find('.' + defaultProps.backdropClassName!).simulate('click')
      expect(onVisibleChange).toHaveBeenCalledTimes(1)
      expect(onVisibleChange).toHaveBeenLastCalledWith(false)
    })

    it('support `"static"`', () => {
      const portalRef = createRef<Portal>()
      const onVisibleChange = jest.fn()

      const modalWrapper = mount(
        <Modal
          visible={false}
          onVisibleChange={onVisibleChange}
          backdrop="static"
          portalRef={portalRef}
        />,
      )

      expect(portalRef.current!.portal).toMatchSnapshot()

      modalWrapper.find('.' + defaultProps.backdropClassName!).simulate('click')
      expect(onVisibleChange).not.toHaveBeenCalled()
    })

    it('support `false`', () => {
      const portalRef = createRef<Portal>()

      mount(
        <Modal
          visible={false}
          onVisibleChange={jest.fn()}
          backdrop={false}
          portalRef={portalRef}
        />,
      )

      expect(portalRef.current!.portal).toMatchSnapshot()
    })
  })
})

describe('useModal', () => {
  const ModalContainer = (props: {
    hookArg: Parameters<typeof useModal>[0]
    helpersRef: React.RefObject<useModal.Helpers>
  }) => {
    const [modal, helpers] = useModal(props.hookArg)
    ;(props.helpersRef as any).current = helpers
    return modal
  }

  it('basicly works', () => {
    const onVisibleChange = jest.fn()
    const children = jest.fn(() => <div>hello</div>)
    const helpersRef = React.createRef<useModal.Helpers>()
    const wrapper = shallow(
      <ModalContainer
        helpersRef={helpersRef}
        hookArg={{
          visible: true,
          onVisibleChange,
          children,
        }}
      />,
    )

    expect(wrapper).toMatchSnapshot()
    let helpers = helpersRef.current!
    expect(helpers.visible).toBe(true)
    expect(wrapper.find(Modal).prop('onVisibleChange')).not.toBe(
      onVisibleChange,
    )

    act(() => helpers.hide())
    expect(wrapper).toMatchSnapshot()
    expect(helpersRef.current).not.toBe(helpers)
    expect(helpersRef.current!.visible).toBe(false)

    act(() => helpers.show())
    expect(wrapper).toMatchSnapshot()
    expect(helpersRef.current).not.toBe(helpers)
    expect(helpersRef.current!.visible).toBe(true)
  })
})
