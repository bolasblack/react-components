import * as React from 'react'
import { act, render } from '@testing-library/react'
import {
  Popover,
  PopoverProps,
  PopoverStyle,
  PopoverVisibleInfo,
} from './Popover'
import { Simulate } from 'react-dom/test-utils'
import { describe } from 'node:test'
import userEvent from '@testing-library/user-event'

describe('Popover', () => {
  it('basically works', () => {
    const { wrapper } = renderComp({
      triggerClassName: 'test-trigger-class',
      popoverClassName: 'test-popover-class',
      visible: true,
    })
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('support `popoverStyle` prop', async () => {
    const popoverStyleReturnDataKey = '--test-key'
    const popoverStyleReturnDataValue = Date.now()
    const popoverStyle = jest.fn(
      (): PopoverStyle =>
        ({ [popoverStyleReturnDataKey]: popoverStyleReturnDataValue }) as any,
    )

    const { getEl, wrapper, triggerContainer, popoverContainer } = renderComp({
      popoverStyle,
    })

    expect(popoverStyle).toHaveBeenCalledTimes(1)
    expect(popoverStyle).toHaveBeenLastCalledWith({
      visible: false,
      popoverTop: 0,
      popoverLeft: 0,
    } as PopoverVisibleInfo)

    const boundingClientRect = {
      x: 20,
      y: 20,
      top: 20,
      left: 20,
      bottom: 60,
      right: 60,
      width: 40,
      height: 40,
    }
    triggerContainer().getBoundingClientRect = (): DOMRect => ({
      ...boundingClientRect,
      toJSON() {
        return this
      },
    })
    document.documentElement.scrollTop = 60
    document.documentElement.scrollLeft = 30
    wrapper.rerender(getEl({}))
    expect(popoverStyle).toHaveBeenCalledTimes(2)
    expect(popoverStyle).toHaveBeenLastCalledWith({
      visible: false,
      popoverTop:
        boundingClientRect.top +
        boundingClientRect.height +
        document.documentElement.scrollTop,
      popoverLeft:
        boundingClientRect.left +
        boundingClientRect.width / 2 +
        document.documentElement.scrollLeft,
    } as PopoverVisibleInfo)

    wrapper.rerender(getEl({ visible: true }))
    expect(popoverStyle).toHaveBeenCalledTimes(3)
    expect(popoverStyle).toHaveBeenLastCalledWith({
      visible: true,
      popoverTop:
        boundingClientRect.top +
        boundingClientRect.height +
        document.documentElement.scrollTop,
      popoverLeft:
        boundingClientRect.left +
        boundingClientRect.width / 2 +
        document.documentElement.scrollLeft,
    } as PopoverVisibleInfo)

    expect(popoverContainer().style[popoverStyleReturnDataKey as any]).toBe(
      popoverStyleReturnDataValue,
    )
  })

  describe('`openOn` prop', async () => {
    it('support `openOn=hover`', async () => {
      await assertPopover({
        openOn: 'hover',
        visible: true,
        event: 'mouseEnter',
      })
      await assertPopover({ openOn: 'hover', visible: false, event: 'click' })
    })

    it('support `openOn=click`', async () => {
      await assertPopover({ openOn: 'click', visible: true, event: 'click' })
      await assertPopover({
        openOn: 'click',
        visible: false,
        event: 'mouseEnter',
      })
    })

    async function assertPopover(opts: {
      openOn: PopoverProps['openOn']
      visible: boolean
      event: keyof typeof Simulate
    }): Promise<void> {
      const onVisibleChange = jest.fn()
      const { triggerContainer } = renderComp({
        openOn: opts.openOn,
        onVisibleChange,
      })
      await act(() => Simulate[opts.event](triggerContainer()))
      if (opts.visible) {
        expect(onVisibleChange).toHaveBeenLastCalledWith(opts.visible, {
          event: expect.anything(),
        })
      } else {
        expect(onVisibleChange).not.toHaveBeenCalled()
      }
    }
  })

  describe('`closeOn` prop', async () => {
    it('support `closeOn=hover`', async () => {
      await assertPopover(
        { visible: true, closeOn: 'hover' },
        {
          invisible({ triggerContainer }) {
            Simulate.mouseLeave(triggerContainer())
          },
          initial({}, { onVisibleChange }) {
            expect(onVisibleChange).not.toBeCalled()
          },
          final({}, { onVisibleChange }) {
            expect(onVisibleChange).toHaveBeenLastCalledWith(false, {
              event: expect.anything(),
            })
          },
        },
      )
    })

    it('support `closeOn=click`', async () => {
      await assertPopover(
        { visible: true, closeOn: 'click' },
        {
          initial({}, { onVisibleChange }) {
            expect(onVisibleChange).not.toBeCalled()
          },
          async invisible(
            { wrapper, triggerContainer, contentContainer },
            { onVisibleChange },
          ) {
            Simulate.mouseLeave(triggerContainer())
            expect(onVisibleChange).not.toBeCalled()

            Simulate.mouseLeave(contentContainer())
            expect(onVisibleChange).not.toBeCalled()

            await userEvent.click(triggerContainer())
            expect(onVisibleChange).toBeCalledTimes(1)
            expect(onVisibleChange).toHaveBeenLastCalledWith(false, {
              event: expect.anything(),
            })

            await userEvent.click(contentContainer())
            expect(onVisibleChange).toBeCalledTimes(2)
            expect(onVisibleChange).toHaveBeenLastCalledWith(false, {
              event: expect.anything(),
            })

            await userEvent.click(wrapper.baseElement)
            expect(onVisibleChange).toBeCalledTimes(3)
            expect(onVisibleChange).toHaveBeenLastCalledWith(false, {
              event: expect.anything(),
            })
          },
        },
      )
    })

    it('support `closeOn=clickInside`', async () => {
      await assertPopover(
        { visible: true, closeOn: 'clickInside' },
        {
          initial({}, { onVisibleChange }) {
            expect(onVisibleChange).not.toBeCalled()
          },
          async invisible(
            { wrapper, triggerContainer, contentContainer },
            { onVisibleChange },
          ) {
            Simulate.mouseLeave(triggerContainer())
            expect(onVisibleChange).not.toBeCalled()

            Simulate.mouseLeave(contentContainer())
            expect(onVisibleChange).not.toBeCalled()

            await userEvent.click(triggerContainer())
            expect(onVisibleChange).toBeCalledTimes(1)
            expect(onVisibleChange).toHaveBeenLastCalledWith(false, {
              event: expect.anything(),
            })

            await userEvent.click(contentContainer())
            expect(onVisibleChange).toBeCalledTimes(2)
            expect(onVisibleChange).toHaveBeenLastCalledWith(false, {
              event: expect.anything(),
            })

            await userEvent.click(wrapper.baseElement)
            expect(onVisibleChange).toBeCalledTimes(2)
          },
        },
      )
    })

    it('support `closeOn=clickOutside`', async () => {
      await assertPopover(
        { visible: true, closeOn: 'clickOutside' },
        {
          initial({}, { onVisibleChange }) {
            expect(onVisibleChange).not.toBeCalled()
          },
          async invisible(
            { wrapper, triggerContainer, contentContainer },
            { onVisibleChange },
          ) {
            Simulate.mouseLeave(triggerContainer())
            expect(onVisibleChange).not.toBeCalled()

            Simulate.mouseLeave(contentContainer())
            expect(onVisibleChange).not.toBeCalled()

            await userEvent.click(triggerContainer())
            expect(onVisibleChange).not.toBeCalled()

            await userEvent.click(contentContainer())
            expect(onVisibleChange).not.toBeCalled()

            await userEvent.click(wrapper.baseElement)
            expect(onVisibleChange).toHaveBeenLastCalledWith(false, {
              event: expect.anything(),
            })
          },
        },
      )
    })

    type StepCallback<T = void> = (
      renderRes: ReturnType<typeof renderComp>,
      context: { onVisibleChange: jest.Mock },
    ) => T

    async function assertPopover(
      props: Partial<PopoverProps>,
      steps: Partial<{
        initial: StepCallback
        visible: StepCallback<void | Promise<void>>
        between: StepCallback
        invisible: StepCallback<void | Promise<void>>
        final: StepCallback
      }>,
    ): Promise<void> {
      const onVisibleChange = jest.fn(props.onVisibleChange)
      const renderRes = renderComp({
        visible: false,
        ...props,
        onVisibleChange,
      })
      steps.initial?.(renderRes, { onVisibleChange })

      if (steps.visible) {
        await act(() => steps.visible?.(renderRes, { onVisibleChange }))
        renderRes.wrapper.rerender(renderRes.getEl({ visible: true }))
      }

      steps.between?.(renderRes, { onVisibleChange })

      if (steps.invisible) {
        await act(() => steps.invisible?.(renderRes, { onVisibleChange }))
        renderRes.wrapper.rerender(renderRes.getEl({ visible: false }))
      }

      steps.final?.(renderRes, { onVisibleChange })
      renderRes.wrapper.unmount()
    }
  })

  it('support `disabled` prop', async () => {
    const onVisibleChange = jest.fn()
    const popoverStyle = jest.fn((a: any) => a)
    const content = jest.fn(() => <div className="content" />)
    const { getEl, wrapper, triggerContainer } = renderComp({
      openOn: 'hover',
      disabled: true,
      popoverStyle,
      content,
    })

    expect(content).toHaveBeenCalledTimes(0)
    expect(popoverStyle).toHaveBeenCalledTimes(0)

    Simulate.mouseEnter(triggerContainer())
    expect(onVisibleChange).toHaveBeenCalledTimes(0)
    expect(content).toHaveBeenCalledTimes(0)
    expect(popoverStyle).toHaveBeenCalledTimes(0)

    wrapper.rerender(getEl({ openOn: 'click' }))
    await userEvent.click(triggerContainer())
    expect(onVisibleChange).toHaveBeenCalledTimes(0)
    expect(content).toHaveBeenCalledTimes(0)
    expect(popoverStyle).toHaveBeenCalledTimes(0)
  })

  describe('support `portal` prop', () => {
    it('is enabled by default', () => {
      const { wrapper } = renderComp({})
      expect(wrapper.baseElement).toMatchSnapshot()
    })

    it('can be disabled', () => {
      const { wrapper } = renderComp({ inline: true })
      expect(wrapper.baseElement).toMatchSnapshot()
    })
  })
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const renderComp = (defaultProps: Partial<PopoverProps>) => {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(document as any)['scrollingElement'] = document.documentElement

  const getEl = (props: Partial<PopoverProps>): JSX.Element => (
    <Popover
      trigger={() => <div className="trigger" />}
      content={() => <div className="content" />}
      {...defaultProps}
      {...props}
    />
  )

  const wrapper = render(getEl({}))

  const popoverContainer = (): HTMLElement =>
    wrapper.baseElement.querySelector('.Popover__container')! as HTMLElement

  const triggerContainer = (): HTMLElement =>
    wrapper.baseElement.querySelector('.Popover__trigger')! as HTMLElement

  const contentContainer = (): HTMLElement =>
    wrapper.baseElement.querySelector('.Popover__content')! as HTMLElement

  return {
    getEl,
    wrapper,
    popoverContainer,
    triggerContainer,
    contentContainer,
  }
}
