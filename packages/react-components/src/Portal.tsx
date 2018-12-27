import { equals } from 'ramda'
import { SimpleJSON } from '@c4605-toolkit/ts-types'

export interface PortalProps {
  /** Specify the parent element for portal */
  parent: HTMLElement
  /** Children in portal */
  children: React.ReactNode

  /** Specify portal class  */
  className: string
  /** Specify portal style  */
  style: React.CSSProperties & SimpleJSON

  /** The visibility of portal */
  visible: boolean
  /** Will be call when the visibility need to be changed */
  onVisibleChange: (visible: boolean) => void

  /** Hide portal when function return true */
  clickClose: (event: MouseEvent) => void | boolean
}

export class Portal extends React.PureComponent<PortalProps> {
  static defaultProps = {
    parent: document.body,
    className: '',
    style: {},
    visible: false,
    onVisibleChange: () => {},
    clickClose: () => {},
  }

  portal = document.createElement('div')

  componentDidMount() {
    this.updateNode(null, this.props)
  }

  componentDidUpdate(prevProps: PortalProps) {
    this.updateNode(prevProps, this.props)
  }

  componentWillUnmount() {
    this.updateNode(this.props, null)
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.portal)
  }

  private updateNode(
    prevProps: PortalProps | null,
    nextProps: PortalProps,
  ): void
  private updateNode(
    prevProps: PortalProps,
    nextProps: PortalProps | null,
  ): void
  private updateNode(
    prevProps: PortalProps | null,
    nextProps: PortalProps | null,
  ) {
    const { portal } = this

    if (!prevProps || !nextProps || prevProps.parent !== nextProps.parent) {
      prevProps && prevProps.parent.removeChild(this.portal)
      nextProps && nextProps.parent.appendChild(this.portal)
    }

    document.removeEventListener('click', this.onClickDocument)
    if (
      (!prevProps && nextProps && nextProps.visible) ||
      (prevProps &&
        nextProps &&
        prevProps.visible !== nextProps.visible &&
        nextProps.visible)
    ) {
      document.addEventListener('click', this.onClickDocument)
    }

    if (nextProps) {
      if (!prevProps || prevProps.className !== nextProps.className) {
        portal.setAttribute('class', nextProps.className.trim() || '')
      }

      const prevStyle = prevProps && prevProps.style
      const nextStyle = nextProps.style
      if (!equals(prevStyle, nextStyle)) {
        portal.removeAttribute('style')
        Object.assign(
          portal.style,
          { display: nextProps.visible ? 'block' : 'none' },
          nextStyle,
        )
      } else {
        portal.style.display = nextProps.visible ? 'block' : 'none'
      }
    }
  }

  private onClickDocument = (event: MouseEvent) => {
    if (!this.props.visible) return
    const { portal } = this
    if (!portal || (event.button && event.button !== 0)) return
    if (this.props.clickClose(event)) {
      this.props.onVisibleChange(false)
    }
  }
}
