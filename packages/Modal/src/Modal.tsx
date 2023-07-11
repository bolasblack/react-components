import * as React from 'react'
import {
  FC,
  ReactNode,
  ReactElement,
  useMemo,
  useState,
  useEffect,
  Ref,
} from 'react'
import { Portal, OnVisibleChangeCallback } from '@c4605/react-portal'
import cssText from './Modal.css'

export interface ModalProps {
  /**
   * The visibility of modal
   */
  visible: boolean

  /**
   * Will be call when the visibility need to be changed
   */
  onVisibleChange: OnVisibleChangeCallback

  /**
   * Backdrop style
   *
   * * `"clickHide"`: Show backdrop, request change visibility on clicked
   * * `"static"`: Show backdrop, do nothing on clicked
   * * `false`: Do not show backdrop
   */
  backdrop?: 'clickHide' | 'static' | false

  /**
   * Children in modal body
   */
  children?: ReactNode

  /**
   * Modal portal element class name
   */
  portalClassName?: string

  /**
   * Modal [portal](/portal-readme) ref
   */
  portalRef?: Ref<Portal>
  /**
   * Modal [portal](/portal-readme)'s container ref
   */
  portalContainerRef?: Ref<HTMLElement>

  /**
   * Specify the parent element of portal
   */
  partalParent?: HTMLElement | (() => HTMLElement)

  /**
   * document.[documentElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement) class name
   */
  documentElementClassName?: string

  /**
   * document.[documentElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement) class name when modal visible.
   *
   * Use `null` to prevent add class name to documentElement
   */
  documentElementClassNameWhenVisible?: string | null

  /**
   * document.[documentElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement) class name when modal invisible.
   *
   * Use `null` to prevent add class name to documentElement
   */
  documentElementClassNameWhenInvisible?: string | null

  /**
   * Modal backdrop element class name
   */
  backdropClassName?: string

  /**
   * Modal backdrop element ref
   */
  backdropRef?: Ref<HTMLDivElement>

  /**
   * Modal body element class name
   */
  bodyClassName?: string

  /**
   * Modal body element ref
   */
  bodyRef?: Ref<HTMLDivElement>
}

export const Modal: FC<ModalProps> = function Modal(props) {
  const { visible, onVisibleChange } = props

  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = cssText
    document.head.appendChild(el)
    return () => {
      document.head.removeChild(el)
    }
  }, [])

  const {
    documentElementClassName,
    documentElementClassNameWhenVisible,
    documentElementClassNameWhenInvisible,
  } = props
  useEffect(() => {
    const classNames = [documentElementClassName]
    if (visible && documentElementClassNameWhenVisible) {
      classNames.push(documentElementClassNameWhenVisible)
    }
    if (!visible && documentElementClassNameWhenInvisible) {
      classNames.push(documentElementClassNameWhenInvisible)
    }
    const finalClassNames = classNames.join(' ').split(' ')
    document.documentElement.classList.add(...finalClassNames)
    return () => {
      document.documentElement.classList.remove(...finalClassNames)
    }
  }, [
    visible,
    documentElementClassName,
    documentElementClassNameWhenVisible,
    documentElementClassNameWhenInvisible,
  ])

  const { backdrop, backdropRef, backdropClassName } = props
  const backdropElem = useMemo(
    () =>
      !backdrop ? null : (
        <div
          ref={backdropRef}
          className={backdropClassName}
          onClick={(event: React.MouseEvent) => {
            if (backdrop === 'static') return
            onVisibleChange?.(false, { event: event.nativeEvent })
          }}
        />
      ),
    [backdrop, backdropRef, backdropClassName, onVisibleChange],
  )

  const {
    portalRef,
    portalContainerRef,
    portalClassName,
    partalParent,
    bodyRef,
    bodyClassName,
    children,
  } = props
  const portal = useMemo(
    () => (
      <Portal
        ref={portalRef}
        portalContainerRef={portalContainerRef}
        className={portalClassName}
        visible={visible}
        parent={partalParent}
      >
        {backdropElem}
        <div ref={bodyRef} className={bodyClassName}>
          {children}
        </div>
      </Portal>
    ),
    [
      portalRef,
      portalContainerRef,
      portalClassName,
      visible,
      partalParent,
      backdropElem,
      bodyRef,
      bodyClassName,
      children,
    ],
  )

  return portal
}

Modal.defaultProps = {
  backdrop: 'clickHide',
  documentElementClassName: 'Modal__html',
  documentElementClassNameWhenVisible: 'Modal__html--visible',
  documentElementClassNameWhenInvisible: null,
  portalClassName: 'Modal',
  backdropClassName: 'Modal__backdrop',
  bodyClassName: 'Modal__body',
}

export function useModal({
  onVisibleChange: _,
  visible: initialVisible = false,
  children,
  ...props
}: Partial<Omit<ModalProps, 'children'>> & {
  children?: (helpers: useModal.Controller) => ReactNode
}): useModal.Return {
  const [visible, setVisible] = useState(initialVisible)

  const ctrl = useMemo(
    () => ({
      visible,
      setVisible,
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }),
    [visible],
  )

  const renderedChildren = useMemo(
    () => typeof children === 'function' && children(ctrl),
    [children, ctrl],
  )

  const instance = (
    <Modal visible={visible} onVisibleChange={setVisible} {...props}>
      {renderedChildren}
    </Modal>
  )

  return [instance, ctrl]
}

export namespace useModal {
  export interface Controller {
    visible: boolean
    setVisible: (visible: boolean) => void
    show: () => void
    hide: () => void
  }

  // legacy
  export type Helpers = Controller

  export type Return = [ReactElement<ModalProps>, Controller]
}
