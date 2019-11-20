/* tslint:disable:no-string-literal */

import * as React from 'react'
import { mount } from 'enzyme'
import { Portal } from '@c4605/react-portal'
import { Popover, PopoverProps, PopoverVisibleInfo } from './Popover'

describe('Popover', () => {
  it('basicly works', () => {
    const { wrapper } = render({})
    expect(wrapper.find('.trigger')).toHaveLength(1)
    expect(wrapper.find('.content')).toHaveLength(0)
    expect(wrapper.find(Portal)).toHaveLength(1)
    expect(wrapper.find(Portal).props()).toMatchObject({
      parent: Popover.popoverContainer,
    })
  })

  it('support `triggerClassName` prop', () => {
    const { wrapper } = render({ triggerClassName: 'test-trigger-class' })
    expect(
      wrapper.find('.Popover__trigger').hasClass('test-trigger-class'),
    ).toBe(true)
  })

  it('support `popoverClassName` prop', () => {
    const { wrapper } = render({ popoverClassName: 'test-popover-class' })
    expect(
      wrapper.find('.Popover__container').hasClass('test-popover-class'),
    ).toBe(true)
  })

  it('support `popoverStyle` prop', () => {
    const popoverStyleReturn: ReturnType<PopoverProps['popoverStyle']> = {}
    const popoverStyle = jest.fn(() => popoverStyleReturn)
    const { wrapper, triggerContainer } = render({ popoverStyle })

    expect(popoverStyle).toHaveBeenCalledTimes(1)
    expect(popoverStyle).toHaveBeenLastCalledWith({
      visible: false,
      popoverTop: 0,
      popoverLeft: 0,
    } as PopoverVisibleInfo)
    wrapper.setState({ _: Math.random() } as any)
    expect(popoverStyle).toHaveBeenCalledTimes(2)
    expect(popoverStyle).toHaveBeenLastCalledWith({
      visible: false,
      popoverTop: 0,
      popoverLeft: 0,
    } as PopoverVisibleInfo)

    const triggerContainerElem = triggerContainer.getDOMNode() as HTMLDivElement
    triggerContainerElem.getBoundingClientRect = (): DOMRect => ({
      x: 20,
      y: 20,
      top: 20,
      left: 20,
      bottom: 60,
      right: 60,
      width: 40,
      height: 40,
      toJSON() {
        return this
      },
    })
    document.documentElement.scrollTop = 60
    document.documentElement.scrollLeft = 30
    wrapper.setState({ _: Math.random() } as any)
    expect(popoverStyle).toHaveBeenCalledTimes(3)
    expect(popoverStyle).toHaveBeenLastCalledWith({
      visible: false,
      popoverTop: 120,
      popoverLeft: 70,
    } as PopoverVisibleInfo)
    wrapper.setState({ _: Math.random() } as any)
    expect(popoverStyle).toHaveBeenCalledTimes(4)
    expect(popoverStyle).toHaveBeenLastCalledWith({
      visible: false,
      popoverTop: 120,
      popoverLeft: 70,
    } as PopoverVisibleInfo)

    expect(wrapper.find(Portal).prop('style')).toBe(popoverStyleReturn)
  })

  it('support `openOn` prop', () => {
    assertPortal({ openOn: 'hover', visible: true, event: 'mouseenter' })
    assertPortal({ openOn: 'hover', visible: false, event: 'click' })
    assertPortal({ openOn: 'click', visible: true, event: 'click' })
    assertPortal({ openOn: 'click', visible: false, event: 'mouseenter' })

    function assertPortal(opts: {
      openOn: PopoverProps['openOn']
      visible: boolean
      event: string
    }) {
      const { wrapper, triggerContainer } = render({ openOn: opts.openOn })
      expect(wrapper.find(Portal).prop('visible')).toBe(false)
      triggerContainer.simulate(opts.event)
      expect(wrapper.find(Portal).prop('visible')).toBe(opts.visible)
    }
  })

  it('support `closeOn` prop', async () => {
    assertPortal({
      closeOn: 'hover',
      visible: false,
      between({ triggerContainer }) {
        triggerContainer.simulate('mouseleave')
      },
    })
    assertPortal({
      closeOn: 'hover',
      visible: false,
      between({ contentContainer }) {
        contentContainer.simulate('mouseleave')
      },
    })
    assertPortal({
      closeOn: 'clickInside',
      visible: true,
      between({ wrapper, triggerContainer, contentContainer }) {
        triggerContainer.simulate('mouseleave')
        expect(wrapper.find(Portal).prop('visible')).toBe(true)
        contentContainer.simulate('mouseleave')
        expect(wrapper.find(Portal).prop('visible')).toBe(true)

        const { clickClose } = wrapper.find(Portal).props()
        expect(clickClose(mouseEvent(contentContainer.getDOMNode()))).toBe(true)
        expect(clickClose(mouseEvent(document.body))).toBe(false)
      },
    })
    assertPortal({
      closeOn: 'clickOutside',
      visible: true,
      between({ wrapper, triggerContainer, contentContainer }) {
        triggerContainer.simulate('mouseleave')
        expect(wrapper.find(Portal).prop('visible')).toBe(true)
        contentContainer.simulate('mouseleave')
        expect(wrapper.find(Portal).prop('visible')).toBe(true)

        const { clickClose } = wrapper.find(Portal).props()
        expect(clickClose(mouseEvent(contentContainer.getDOMNode()))).toBe(
          false,
        )
        expect(clickClose(mouseEvent(document.body))).toBe(true)
      },
    })

    function mouseEvent(target: Element): MouseEvent {
      return { target } as any
    }

    function assertPortal(opts: {
      closeOn: PopoverProps['closeOn']
      visible: boolean
      between: (wrappers: ReturnType<typeof render>) => void
    }) {
      const wrappers = render({ closeOn: opts.closeOn })
      const { wrapper, triggerContainer } = wrappers
      triggerContainer.simulate('mouseenter')
      expect(wrapper.find(Portal).prop('visible')).toBe(true)
      opts.between(wrappers)
      expect(wrapper.find(Portal).prop('visible')).toBe(opts.visible)
    }
  })

  it('can follow State Up pattern', () => {
    const onVisibleChange = jest.fn()
    const { wrapper, triggerContainer } = render({
      visible: true,
      onVisibleChange,
    })
    expect(wrapper.find(Portal).prop('visible')).toBe(true)
    triggerContainer.simulate('mouseleave')
    expect(onVisibleChange).toHaveBeenCalledWith(false)
    expect(wrapper.find(Portal).prop('visible')).toBe(true)
  })

  describe('support `disabled` prop', () => {
    it('in normal case', () => {
      const popoverStyle = jest.fn((a: any) => a)
      const content = jest.fn(() => <div className="content" />)
      const { wrapper, triggerContainer } = render({ popoverStyle, content })

      triggerContainer.simulate('mouseenter')
      expect(wrapper.find(Portal).prop('visible')).toBe(true)
      expect(content).toHaveBeenCalledTimes(1)
      expect(popoverStyle).toHaveBeenCalledTimes(2)

      wrapper.setProps({ disabled: true })
      expect(wrapper.find(Portal).prop('visible')).toBe(false)
      expect(content).toHaveBeenCalledTimes(1)
      expect(popoverStyle).toHaveBeenCalledTimes(2)

      triggerContainer.simulate('mouseenter')
      expect(wrapper.find(Portal).prop('visible')).toBe(false)
      expect(content).toHaveBeenCalledTimes(1)
      expect(popoverStyle).toHaveBeenCalledTimes(2)

      wrapper.setProps({ openOn: 'click' })
      triggerContainer.simulate('click')
      expect(wrapper.find(Portal).prop('visible')).toBe(false)
      expect(content).toHaveBeenCalledTimes(1)
      expect(popoverStyle).toHaveBeenCalledTimes(2)
    })

    it('in State Up pattern', () => {
      const onVisibleChange = jest.fn()
      const popoverStyle = jest.fn((a: any) => a)
      const content = jest.fn(() => <div className="content" />)
      const { wrapper, triggerContainer } = render({
        disabled: true,
        popoverStyle,
        content,
        visible: true,
        onVisibleChange,
      })
      expect(wrapper.find(Portal).prop('visible')).toBe(false)
      expect(content).not.toHaveBeenCalled()
      expect(popoverStyle).not.toHaveBeenCalled()
      expect(onVisibleChange).not.toHaveBeenCalled()
      triggerContainer.simulate('mouseenter')
      expect(wrapper.find(Portal).prop('visible')).toBe(false)
      expect(content).not.toHaveBeenCalled()
      expect(popoverStyle).not.toHaveBeenCalled()
      expect(onVisibleChange).not.toHaveBeenCalled()
    })
  })
})

const render = (props: Partial<PopoverProps>) => {
  ;(document as any)['scrollingElement'] = document.documentElement

  const wrapper = mount<Popover>(
    <Popover
      trigger={() => <div className="trigger" />}
      content={() => <div className="content" />}
      {...props}
    />,
  )

  const triggerContainer = wrapper.find('.Popover__trigger')
  ;(wrapper.instance()['triggerContainerRef'] as any)[
    'current'
  ] = triggerContainer.getDOMNode()

  const contentContainer = wrapper.find('.Popover__content')
  ;(wrapper.instance()['contentContainerRef'] as any)[
    'current'
  ] = contentContainer.getDOMNode()

  wrapper.setState({ _: Math.random() } as any)
  return {
    wrapper,
    triggerContainer,
    contentContainer,
  }
}
