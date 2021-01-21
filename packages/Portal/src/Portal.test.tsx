import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { mount, ReactWrapper } from 'enzyme'
import { Portal, PortalProps } from './Portal'

describe('Portal', () => {
  let wrapper: ReactWrapper<PortalProps>

  afterEach(() => {
    try {
      wrapper.unmount()
    } catch {}
  })

  it('basicly works', () => {
    wrapper = mount(
      <div>
        <Portal className="portal" />
      </div>,
    )
    const portalEl = getPortalContainerEl(wrapper)
    expect(portalEl.parentElement).toBe(document.body)

    wrapper.unmount()
    expect(portalEl.parentElement).toBe(null)
    expect(document.querySelectorAll('.portal')).toHaveLength(0)
  })

  describe('support `parent` prop', () => {
    function assertParentPropWorks(
      wrapper: ReactWrapper<PortalProps>,
      parent: HTMLElement,
    ): void {
      const portalEl = getPortalContainerEl(wrapper)
      expect(portalEl.parentElement).toBe(parent)
      expect(findDOMNode(wrapper.instance())).toMatchSnapshot()
      wrapper.unmount()
      expect(portalEl.parentElement).toBe(null)
      expect(document.querySelectorAll('.portal')).toHaveLength(0)
    }

    it('as an element', () => {
      const parent = document.createElement('div')
      wrapper = mount(
        <div>
          <Portal parent={parent} />
        </div>,
      )
      assertParentPropWorks(wrapper, parent)
    })

    it('as a function', () => {
      const parent = document.createElement('div')
      wrapper = mount(
        <div>
          <Portal parent={() => parent} />
        </div>,
      )
      assertParentPropWorks(wrapper, parent)
    })

    it('as null', () => {
      wrapper = mount(
        <div>
          <Portal parent={null}>
            <div id="testEl" />
          </Portal>
        </div>,
      )
      expect(wrapper.find('#testEl')).toHaveLength(1)
      expect(findDOMNode(wrapper.instance())).toMatchSnapshot()
      wrapper.unmount()
      expect(wrapper.find('#testEl')).toHaveLength(0)
    })
  })

  function assertInAllRenderMode(
    asserts: (renderer: typeof render) => any,
  ): void {
    const parent = document.createElement('div')

    asserts(props => render({ ...props }))
    asserts(props => render({ ...props, parent }))
    asserts(props => render({ ...props, parent: () => parent }))
    asserts(props => render({ ...props, parent: null }))
  }

  it('support `className` prop', () => {
    assertInAllRenderMode(render => {
      const portalEl = getPortalContainerEl(
        render({ className: 'test-portal' }),
      )
      expect(portalEl.className).toBe('test-portal')
    })
  })

  it('support `style` prop', () => {
    assertInAllRenderMode(render => {
      const portalEl = getPortalContainerEl(
        render({
          style: {
            width: '10px',
            '--css-variable': '#eaeaea',
          },
        }),
      )
      expect(portalEl.style.cssText).toBe(
        'width: 10px; --css-variable: #eaeaea;',
      )
    })
  })

  it('support `visible` prop', () => {
    assertInAllRenderMode(render => {
      wrapper = render({ visible: false })
      const portalEl = getPortalContainerEl(wrapper)

      expect(portalEl.style.display).toBe('none')

      wrapper.setProps({ visible: true })
      expect(portalEl.style.display).toBe('')

      wrapper.setProps({ visible: false })
      expect(portalEl.style.display).toBe('none')
    })
  })

  it('support `clickClose` and `onVisibleChange` prop', () => {
    assertInAllRenderMode(render => {
      let clickCloseReturn: boolean | undefined
      const fakeClickEvent = new Event('click')
      const clickClose = jest.fn(() => clickCloseReturn)
      const onVisibleChange = jest.fn()
      wrapper = render({ visible: false, clickClose, onVisibleChange })
      const portalEl = getPortalContainerEl(wrapper)

      document.dispatchEvent(fakeClickEvent)
      expect(clickClose).not.toBeCalled()
      expect(portalEl.style.display).toBe('none')

      wrapper.setProps({ visible: true })

      document.dispatchEvent(fakeClickEvent)
      expect(clickClose).toHaveBeenCalledTimes(1)
      expect(clickClose).toHaveBeenCalledWith(fakeClickEvent)
      expect(onVisibleChange).not.toBeCalled()

      clickCloseReturn = false

      document.dispatchEvent(fakeClickEvent)
      expect(clickClose).toHaveBeenCalledTimes(2)
      expect(clickClose).toHaveBeenLastCalledWith(fakeClickEvent)
      expect(onVisibleChange).not.toBeCalled()

      clickCloseReturn = true

      document.dispatchEvent(fakeClickEvent)
      expect(clickClose).toHaveBeenCalledTimes(3)
      expect(clickClose).toHaveBeenLastCalledWith(fakeClickEvent)
      expect(onVisibleChange).toHaveBeenCalledTimes(1)
      expect(onVisibleChange).toHaveBeenCalledWith(
        false,
        expect.objectContaining({
          event: fakeClickEvent,
        }),
      )

      wrapper.unmount()
      document.dispatchEvent(fakeClickEvent)
      expect(clickClose).toHaveBeenCalledTimes(3)
      expect(onVisibleChange).toHaveBeenCalledTimes(1)
    })
  })
})

const getPortal = (wrapper: ReactWrapper<any>): Portal =>
  wrapper
    .find(Portal)
    .at(0)
    .instance() as Portal

const getPortalContainerEl = (wrapper: ReactWrapper<any>): HTMLDivElement => {
  const portal = getPortal(wrapper)
  if (portal.props.parent) {
    return portal['_portalEl']
  } else {
    return findDOMNode(portal) as HTMLDivElement
  }
}

const render = (props: Partial<PortalProps>): ReactWrapper<PortalProps> =>
  mount(<Portal {...props} />)
