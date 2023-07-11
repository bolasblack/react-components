import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { SimpleJSON } from '@c4605/ts-types'
import shallowEqual from 'shallowequal'

export type OnVisibleChangeCallback = (
  visible: boolean,
  reason: { event?: Event },
) => void

export interface PortalProps {
  portalContainerRef?: React.Ref<HTMLElement>

  /**
   * Specify the element to listen the click-outside event,
   *
   * if omitted, use the `document.documentElement`
   */
  baseElement?: HTMLElement
  /**
   * Specify the parent element for portal,
   *
   * * if `null`, render children inline
   * * if omitted, use the `document.body`
   */
  parent?: null | HTMLElement | (() => HTMLElement)
  /** Children in portal */
  children?: React.ReactNode

  /** Specify portal class name */
  className?: string
  /** Specify portal style */
  style?: React.CSSProperties & SimpleJSON

  /** The visibility of portal */
  visible?: boolean
  /** Will be call when the visibility needs to be changed */
  onVisibleChange?: OnVisibleChangeCallback
}

export class Portal extends React.PureComponent<PortalProps> {
  static displayName = 'Portal'

  private _portalEl = document.createElement('div')

  componentDidMount(): void {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(this.props.baseElement ?? document.documentElement).addEventListener(
      'click',
      this._onClickDocument,
    )
    this._assignRef(this.props.portalContainerRef, this._portalEl)
    this._updatePortalEl(this._portalEl, null, this.props)
  }

  componentDidUpdate(prevProps: PortalProps): void {
    this._updatePortalEl(this._portalEl, prevProps, this.props)
  }

  componentWillUnmount(): void {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(this.props.baseElement ?? document.documentElement).removeEventListener(
      'click',
      this._onClickDocument,
    )
    this._updatePortalEl(this._portalEl, this.props, null)
    this._assignRef(this.props.portalContainerRef, null)
  }

  render(): React.ReactNode {
    if (this._getParent(this.props)) {
      return ReactDOM.createPortal(this.props.children, this._portalEl)
    }

    return (
      <div
        className={this.props.className}
        style={{
          ...this._getDisplayStyle(this.props.visible),
          ...this.props.style,
        }}
      >
        {this.props.children}
      </div>
    )
  }

  private _updatePortalEl(
    portalEl: HTMLElement,
    prevProps: PortalProps | null,
    nextProps: PortalProps,
  ): void
  private _updatePortalEl(
    portalEl: HTMLElement,
    prevProps: PortalProps,
    nextProps: PortalProps | null,
  ): void
  private _updatePortalEl(
    portalEl: HTMLElement,
    prevProps: PortalProps | null,
    nextProps: PortalProps | null,
  ): void {
    if (!prevProps || !nextProps || prevProps.parent !== nextProps.parent) {
      this._operateParent(prevProps, parent => parent?.removeChild(portalEl))
      this._operateParent(nextProps, parent => parent?.appendChild(portalEl))
    }

    if (nextProps) {
      if (!prevProps || prevProps.className !== nextProps.className) {
        portalEl.className = nextProps.className?.trim() || ''
      }

      const prevStyle = (prevProps && prevProps.style) ?? {}
      const nextStyle = nextProps.style ?? {}
      if (!shallowEqual(prevStyle, nextStyle)) {
        portalEl.style.cssText = ''
        Object.assign(
          portalEl.style,
          this._getDisplayStyle(nextProps.visible),
          nextStyle,
        )
        Object.keys(nextStyle)
          .filter(p => p.startsWith('--'))
          .forEach(p => {
            portalEl.style.setProperty(p, nextStyle[p])
          })
      } else {
        if (nextProps.visible) {
          portalEl.style.removeProperty('display')
        } else {
          portalEl.style.display = 'none'
        }
      }
    }
  }

  private _assignRef(
    ref: React.Ref<HTMLElement> | undefined,
    el: HTMLElement | null,
  ): void {
    if (ref == null) return

    if (typeof ref === 'function') {
      ref(el)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(ref as any).current = el
    }
  }

  private _getDisplayStyle(visible: undefined | boolean): {
    display?: React.CSSProperties['display']
  } {
    if (visible) {
      return {}
    } else {
      return { display: 'none' }
    }
  }

  private _getParent(props: PortalProps): HTMLElement | null {
    if (props.parent === undefined) {
      return document.body
    } else if (typeof props.parent === 'function') {
      return props.parent()
    } else {
      return props.parent
    }
  }

  private _operateParent(
    props: PortalProps | null,
    operator: (parent: HTMLElement | null) => void,
  ): void {
    if (!props) return
    operator(this._getParent(props))
  }

  private _onClickDocument = (event: MouseEvent): void => {
    /* istanbul ignore next */
    if (!this.props.visible) return
    this.props.onVisibleChange?.(false, { event })
  }
}
