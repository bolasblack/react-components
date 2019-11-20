import {
  ReactNode,
  FunctionComponent,
  RefObject,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react'
import * as React from 'react'
import { Portal, PortalProps } from '@c4605/react-portal'
import './Modal.scss'

export interface ModalProps {
  /**
   * The visibility of modal
   */
  visible: PortalProps['visible']

  /**
   * Will be call when the visibility need to be changed
   */
  onVisibleChange: PortalProps['onVisibleChange']

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
  portalRef?: RefObject<Portal> | ((el: Portal | null) => any)

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
  backdropRef?: RefObject<HTMLDivElement> | ((el: HTMLDivElement | null) => any)

  /**
   * Modal body element class name
   */
  bodyClassName?: string

  /**
   * Modal body element ref
   */
  bodyRef?: RefObject<HTMLDivElement> | ((el: HTMLDivElement | null) => any)
}

export const Modal: FunctionComponent<ModalProps> = function Modal({
  children,
  ...props
}) {
  useEffect(() => {
    const classNames = [props.documentElementClassName]
    if (props.visible && props.documentElementClassNameWhenVisible) {
      classNames.push(props.documentElementClassNameWhenVisible)
    }
    if (!props.visible && props.documentElementClassNameWhenInvisible) {
      classNames.push(props.documentElementClassNameWhenInvisible)
    }
    const finalClassNames = classNames.join(' ').split(' ')
    document.documentElement.classList.add(...finalClassNames)
    return () => {
      document.documentElement.classList.remove(...finalClassNames)
    }
  }, [
    props.visible,
    props.documentElementClassName,
    props.documentElementClassNameWhenVisible,
    props.documentElementClassNameWhenInvisible,
  ])

  const backdrop = useMemo(
    () =>
      !props.backdrop ? null : (
        <div
          ref={props.backdropRef}
          className={props.backdropClassName}
          onClick={() => {
            if (props.backdrop === 'static') return
            props.onVisibleChange(false)
          }}
        />
      ),
    [
      props.backdrop,
      props.backdropRef,
      props.backdropClassName,
      props.onVisibleChange,
    ],
  )

  const portal = useMemo(
    () => (
      <Portal
        ref={props.portalRef}
        className={props.portalClassName}
        visible={props.visible}
        onVisibleChange={props.onVisibleChange}
        parent={props.partalParent}
      >
        {backdrop}
        <div ref={props.bodyRef} className={props.bodyClassName}>
          {children}
        </div>
      </Portal>
    ),
    [
      props.portalRef,
      props.portalClassName,
      props.visible,
      props.onVisibleChange,
      props.partalParent,
      backdrop,
      props.bodyRef,
      props.bodyClassName,
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
}: Partial<ModalProps> & {
  children?: (helpers: useModal.Helpers) => ReactNode
}) {
  const [visible, setVisible] = useState(initialVisible)

  const helpers = {
    visible,
    setVisible,
    show: useCallback(() => setVisible(true), [setVisible]),
    hide: useCallback(() => setVisible(false), [setVisible]),
  }

  const renderedChildren = useMemo(
    () => typeof children === 'function' && children(helpers),
    [visible, setVisible, children],
  )

  const instance = (
    <Modal visible={visible} onVisibleChange={setVisible} {...props}>
      {renderedChildren}
    </Modal>
  )

  return [instance, helpers] as [typeof instance, typeof helpers]
}

export namespace useModal {
  export interface Helpers {
    visible: boolean
    setVisible: (visible: boolean) => void
    show: () => void
    hide: () => void
  }
}
