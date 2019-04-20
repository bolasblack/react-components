import React, { createRef } from 'react'
import { Portal } from '@c4605/react-portal'
import { Modal } from '../'
import { mount } from 'enzyme'

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
