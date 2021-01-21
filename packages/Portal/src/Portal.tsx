import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { SimpleJSON } from '@c4605/ts-types'
import shallowEqual from 'shallowequal'

export interface PortalProps {
  /** Specify the parent element for portal, if `null`, render children inline */
  parent: null | HTMLElement | (() => HTMLElement)
  /** Children in portal */
  children?: React.ReactNode

  /** Specify portal class name */
  className: string
  /** Specify portal style */
  style: React.CSSProperties & SimpleJSON

  /** The visibility of portal */
  visible: boolean
  /** Will be call when the visibility needs to be changed */
  onVisibleChange: (visible: boolean, reason: { event?: Event }) => void

  /**
   * Hide portal when function return true
   * @deprecated Use `onVisibleChange` instead
   */
  clickClose: (event: MouseEvent) => void | boolean
}

export class Portal extends React.PureComponent<PortalProps> {
  static displayName = 'Portal'

  static defaultProps = {
    parent: () => document.body,
    className: '',
    style: {},
    visible: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onVisibleChange() {},
    clickClose(event: MouseEvent) {
      /* istanbul ignore next */
      return event.button && event.button !== 0
    },
  }

  private _portalEl = document.createElement('div')

  /**
   * @deprecated
   */
  portal = this._portalEl

  componentDidMount(): void {
    document.addEventListener('click', this._onClickDocument)
    this._updatePortalEl(null, this.props)
  }

  componentDidUpdate(prevProps: PortalProps): void {
    this._updatePortalEl(prevProps, this.props)
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this._onClickDocument)
    this._updatePortalEl(this.props, null)
  }

  render(): React.ReactNode {
    if (this.props.parent) {
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
    prevProps: PortalProps | null,
    nextProps: PortalProps,
  ): void
  private _updatePortalEl(
    prevProps: PortalProps,
    nextProps: PortalProps | null,
  ): void
  private _updatePortalEl(
    prevProps: PortalProps | null,
    nextProps: PortalProps | null,
  ): void {
    const portalEl = this._portalEl

    if (!prevProps || !nextProps || prevProps.parent !== nextProps.parent) {
      this._operateParent(prevProps, parent => parent?.removeChild(portalEl))
      this._operateParent(nextProps, parent => parent?.appendChild(portalEl))
    }

    if (nextProps) {
      if (!prevProps || prevProps.className !== nextProps.className) {
        portalEl.className = nextProps.className.trim() || ''
      }

      const prevStyle = prevProps && prevProps.style
      const nextStyle = nextProps.style
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

  private _getDisplayStyle(
    visible: boolean,
  ): { display?: React.CSSProperties['display'] } {
    if (visible) {
      return {}
    } else {
      return { display: 'none' }
    }
  }

  private _operateParent(
    props: PortalProps | null,
    operator: (parent: HTMLElement | null) => void,
  ): void {
    if (!props) return
    if (typeof props.parent === 'function') {
      operator(props.parent())
    } else {
      operator(props.parent)
    }
  }

  private _onClickDocument = (event: MouseEvent): void => {
    /* istanbul ignore next */
    if (!this.props.visible) return
    if (this.props.clickClose(event)) {
      this.props.onVisibleChange(false, { event })
    }
  }
}
