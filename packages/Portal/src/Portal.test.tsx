import * as React from 'react'
import { render, act } from '@testing-library/react'
import user from '@testing-library/user-event'
import { Portal, PortalProps } from './Portal'
import { createRef } from 'react'

describe('Portal', () => {
  it('basically works', async () => {
    const res = render(<Portal className="portal" />)

    expect(document.body.querySelector('.portal')).not.toBeFalsy()

    res.unmount()

    expect(document.body.querySelector('.portal')).toBeFalsy()
    expect(res.container.innerHTML).toBe('')
  })

  describe('support `parent` prop', () => {
    function assertParentPropWorks(
      renderModal: (props: Partial<PortalProps>) => JSX.Element,
      parent: null | HTMLElement,
    ): void {
      const res = render(renderModal({ visible: true }))
      expect(parent).toMatchSnapshot()
      expect(res.container).toMatchSnapshot()

      res.rerender(renderModal({ visible: false }))
      expect(parent).toMatchSnapshot()
      expect(res.container).toMatchSnapshot()

      res.unmount()
      expect(parent).toMatchSnapshot()
      expect(res.container).toMatchSnapshot()
    }

    it('as an element', () => {
      const parent = document.createElement('div')
      assertParentPropWorks(p => <Portal {...p} parent={parent} />, parent)
    })

    it('as a function', () => {
      const parent = document.createElement('div')
      assertParentPropWorks(
        p => <Portal {...p} parent={() => parent} />,
        parent,
      )
    })

    it('as null', () => {
      assertParentPropWorks(
        p => (
          <Portal {...p} parent={null}>
            <div id="testEl" />
          </Portal>
        ),
        null,
      )
    })
  })

  async function assertInAllRenderMode(
    asserts: (
      getProps: (props: Partial<PortalProps>) => Partial<PortalProps>,
      containerRef: React.RefObject<HTMLElement>,
    ) => any,
  ): Promise<void> {
    const parent = document.createElement('div')
    const containerRef = createRef<HTMLElement>()

    const wrappedAsserts = (
      overrideProps: Partial<PortalProps>,
    ): Promise<void> =>
      asserts(
        props => ({
          ...props,
          ...overrideProps,
          portalContainerRef: containerRef,
        }),
        containerRef,
      )

    await wrappedAsserts({})
    await wrappedAsserts({ parent })
    await wrappedAsserts({ parent: () => parent })
    await wrappedAsserts({ parent: null })
  }

  it('support `className` prop', async () => {
    await assertInAllRenderMode((getProps, containerRef) => {
      render(renderPortal(getProps({ className: 'test-portal' })))
      expect(containerRef.current!.className).toBe('test-portal')
    })
  })

  it('support `style` prop', async () => {
    await assertInAllRenderMode((getProps, containerRef) => {
      render(
        renderPortal(
          getProps({
            style: {
              width: '10px',
              '--css-variable': '#eaeaea',
            },
          }),
        ),
      )
      expect(containerRef.current!.style.cssText).toBe(
        'display: none; width: 10px; --css-variable: #eaeaea;',
      )
    })
  })

  it('support `visible` prop', async () => {
    await assertInAllRenderMode((getProps, containerRef) => {
      const res = render(renderPortal(getProps({ visible: false })))

      expect(containerRef.current!.style.display).toBe('none')

      res.rerender(renderPortal(getProps({ visible: true })))
      expect(containerRef.current!.style.display).toBe('')

      res.rerender(renderPortal(getProps({ visible: false })))
      expect(containerRef.current!.style.display).toBe('none')
    })
  })

  it('support `onVisibleChange` prop', async () => {
    await assertInAllRenderMode(async getProps => {
      const onVisibleChange = jest.fn()
      const baseElement = document.createElement('div')
      const clickBaseElement = async (): Promise<void> => {
        await act(() => user.click(baseElement))
      }

      const res = render(
        renderPortal(
          getProps({ visible: false, baseElement, onVisibleChange }),
        ),
        { baseElement },
      )

      await clickBaseElement()
      expect(onVisibleChange).toHaveBeenCalledTimes(0)

      res.rerender(
        renderPortal(getProps({ visible: true, baseElement, onVisibleChange })),
      )
      await clickBaseElement()
      expect(onVisibleChange).toHaveBeenCalledTimes(1)
      expect(onVisibleChange).toHaveBeenCalledWith(
        false,
        expect.objectContaining({
          event: expect.any(MouseEvent),
        }),
      )

      res.unmount()
      await clickBaseElement()
      expect(onVisibleChange).toHaveBeenCalledTimes(1)
    })
  })
})

const renderPortal = (props: Partial<PortalProps>): JSX.Element => (
  <Portal {...props} />
)
