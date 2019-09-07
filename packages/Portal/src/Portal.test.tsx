import React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import { Portal, PortalProps } from './Portal'

describe('Portal', () => {
  let wrapper: ReactWrapper

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
    const { portal } = getPortal(wrapper)
    expect(portal.parentElement).toBe(document.body)

    wrapper.unmount()
    expect(portal.parentElement).toBe(null)
    expect(document.querySelectorAll('.portal')).toHaveLength(0)
  })

  describe('support `parent` prop', () => {
    function assertParentPropWorks(wrapper: ReactWrapper, parent: HTMLElement) {
      const { portal } = getPortal(wrapper)
      expect(portal.parentElement).toBe(parent)
      wrapper.unmount()
      expect(portal.parentElement).toBe(null)
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
  })

  it('support `className` prop', () => {
    const { portal } = getPortal(render({ className: 'test-portal' }))
    expect(portal.className).toBe('test-portal')
  })

  it('support `style` prop', () => {
    const { portal } = getPortal(
      render({
        style: {
          '--css-variable': '#eaeaea',
          width: '10px',
        },
      }),
    )
    expect(portal.style.cssText).toBe('width: 10px;')
    // wait https://github.com/jsdom/jsdom/issues/1895
    // expect(portal.style.getPropertyValue('--css-variable')).toBe('#eaeaea')
  })

  it('support `visible` prop', () => {
    wrapper = render({ visible: false })
    const { portal } = getPortal(wrapper)

    expect(portal.style.display).toBe('none')

    wrapper.setProps({ visible: true })
    expect(portal.style.display).toBe('')

    wrapper.setProps({ visible: false })
    expect(portal.style.display).toBe('none')
  })

  it('support `clickClose` and `onVisibleChange` prop', () => {
    let clickCloseReturn: boolean | undefined
    const fakeClickEvent = new Event('click')
    const clickClose = jest.fn(() => clickCloseReturn)
    const onVisibleChange = jest.fn()
    wrapper = render({ visible: false, clickClose, onVisibleChange })
    const { portal } = getPortal(wrapper)

    document.dispatchEvent(fakeClickEvent)
    expect(clickClose).not.toBeCalled()
    expect(portal.style.display).toBe('none')

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
    expect(onVisibleChange).toHaveBeenCalledWith(false)

    wrapper.unmount()
    document.dispatchEvent(fakeClickEvent)
    expect(clickClose).toHaveBeenCalledTimes(3)
    expect(onVisibleChange).toHaveBeenCalledTimes(1)
  })
})

const getPortal = (wrapper: ReactWrapper<any>) =>
  wrapper
    .find(Portal)
    .at(0)
    .instance() as Portal

const render = (props: Partial<PortalProps>) => mount(<Portal {...props} />)
