import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { SimpleJSON } from '@c4605/ts-types'
import shallowEqual from 'shallowequal'

export interface PortalProps {
  /** Specify the parent element for portal */
  parent: HTMLElement | (() => HTMLElement)
  /** Children in portal */
  children?: React.ReactNode

  /** Specify portal class name */
  className: string
  /** Specify portal style */
  style: React.CSSProperties & SimpleJSON

  /** The visibility of portal */
  visible: boolean
  /** Will be call when the visibility need to be changed */
  onVisibleChange: (visible: boolean) => void

  /** Hide portal when function return true */
  clickClose: (event: MouseEvent) => void | boolean
}

export class Portal extends React.PureComponent<PortalProps> {
  static displayName = 'Portal'

  static defaultProps = {
    parent: () => document.body,
    className: '',
    style: {},
    visible: true,
    onVisibleChange() {},
    clickClose(event: MouseEvent) {
      /* istanbul ignore next */
      return event.button && event.button !== 0
    },
  }

  portal = document.createElement('div')

  componentDidMount() {
    document.addEventListener('click', this._onClickDocument)
    this._updateNode(null, this.props)
  }

  componentDidUpdate(prevProps: PortalProps) {
    this._updateNode(prevProps, this.props)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onClickDocument)
    this._updateNode(this.props, null)
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.portal)
  }

  private _updateNode(
    prevProps: PortalProps | null,
    nextProps: PortalProps,
  ): void
  private _updateNode(
    prevProps: PortalProps,
    nextProps: PortalProps | null,
  ): void
  private _updateNode(
    prevProps: PortalProps | null,
    nextProps: PortalProps | null,
  ) {
    const { portal } = this

    if (!prevProps || !nextProps || prevProps.parent !== nextProps.parent) {
      this._operateParent(prevProps, parent => parent.removeChild(this.portal))
      this._operateParent(nextProps, parent => parent.appendChild(this.portal))
    }

    if (nextProps) {
      if (!prevProps || prevProps.className !== nextProps.className) {
        portal.className = nextProps.className.trim() || ''
      }

      const prevStyle = prevProps && prevProps.style
      const nextStyle = nextProps.style
      if (!shallowEqual(prevStyle, nextStyle)) {
        portal.style.cssText = ''
        Object.assign(
          portal.style,
          { display: nextProps.visible ? null : 'none' },
          nextStyle,
        )
        Object.keys(nextStyle)
          .filter(p => p.startsWith('--'))
          .forEach(p => {
            portal.style.setProperty(p, nextStyle[p])
          })
      } else {
        if (nextProps.visible) {
          portal.style.removeProperty('display')
        } else {
          portal.style.display = 'none'
        }
      }
    }
  }

  private _operateParent(
    props: PortalProps | null,
    operator: (parent: HTMLElement) => void,
  ) {
    if (!props) return
    if (typeof props.parent === 'function') {
      operator(props.parent())
    } else {
      operator(props.parent)
    }
  }

  private _onClickDocument = (event: MouseEvent) => {
    /* istanbul ignore next */
    if (!this.props.visible) return
    if (this.props.clickClose(event)) {
      this.props.onVisibleChange(false)
    }
  }
}
