import { Portal } from './Portal'
import { SimpleJSON } from '@c4605/ts-types'

export interface PopoverVisibleInfo {
  visible: boolean
  popoverTop: number
  popoverLeft: number
}

export interface PopoverProps {
  /** Trigger element renderer */
  trigger: () => React.ReactNode
  /** Popover content renderer */
  content: () => React.ReactNode
  /** Trigger container element class */
  triggerClassName: string
  /** Popover container element class */
  popoverClassName: string
  /** Generate popover container inline styles */
  popoverStyle: (info: PopoverVisibleInfo) => React.CSSProperties & SimpleJSON
  /** Popover open cause */
  openOn: 'hover' | 'click'
  /** Popover close cause */
  closeOn: 'hover' | 'clickInside' | 'clickOutside'
  /** Popover visiblity */
  visible?: boolean
  /** Callback when popover visiblity changed */
  onVisibleChange: (visible: boolean) => void
  /** If set to true, popover won't be shown, popoverStyle, content, onVisibleChange won't be called */
  disabled: boolean
}

export interface PopoverState extends PopoverVisibleInfo {}

let popoverContainer: HTMLDivElement | null = null

/**
 * By default, the visible state hosted by Popover.
 *
 * If supplied `visible` prop, Popover will follow the
 * [State Up](https://reactjs.org/docs/lifting-state-up.html) pattern, and when
 * need change visible state, will callback `onVisibleChange(expectedVisibleState)`
 */
export class Popover extends React.PureComponent<PopoverProps, PopoverState> {
  static get popoverContainer() {
    return popoverContainer
  }

  static defaultProps = {
    triggerClassName: '',
    popoverClassName: '',
    openOn: 'hover',
    closeOn: 'hover',
    disabled: false,
    onVisibleChange: Boolean,
    popoverStyle: (info: PopoverVisibleInfo) => ({
      position: 'absolute',
      top: `${info.popoverTop}px`,
      left: `${info.popoverLeft}px`,
      display: 'block',
      visibility: info.visible ? 'visible' : 'hidden',
      transform: 'translateX(-50%)',
    }),
  }

  readonly state: PopoverState = {
    visible: false,
    popoverTop: 0,
    popoverLeft: 0,
  }

  private triggerContainerRef = React.createRef<HTMLDivElement>()

  private contentContainerRef = React.createRef<HTMLDivElement>()

  render() {
    if (!popoverContainer) {
      popoverContainer = document.createElement('div')
      document.body.appendChild(popoverContainer)
    }

    return (
      <React.Fragment>
        <div
          ref={this.triggerContainerRef}
          className={`Popover__trigger ${this.props.triggerClassName}`}
          onClick={this.onTriggerClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {this.props.trigger()}
        </div>
        <Portal
          parent={popoverContainer}
          className={`Popover__container ${this.props.popoverClassName}`}
          style={this.popoverStyle()}
          clickClose={this.clickClose}
          visible={this.visible}
          onVisibleChange={this.changeVisible}
        >
          <div
            ref={this.contentContainerRef}
            className="Popover__content"
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            {!this.visible ? null : this.props.content()}
          </div>
        </Portal>
      </React.Fragment>
    )
  }

  private popoverStyle() {
    if (this.props.disabled) return
    if (!document.scrollingElement) return
    if (!this.triggerContainerRef.current) return
    return this.props.popoverStyle({
      visible: this.visible,
      ...this.getPositionInfo(
        this.triggerContainerRef.current,
        document.scrollingElement,
      ),
    })
  }

  private clickClose = (event: MouseEvent) => {
    if (!this.triggerContainerRef.current) return
    if (!this.contentContainerRef.current) return
    if (!(event.target instanceof HTMLElement)) return
    const clickInside =
      this.triggerContainerRef.current.contains(event.target) ||
      this.contentContainerRef.current.contains(event.target)
    if (this.props.closeOn === 'clickInside') {
      return clickInside
    } else if (this.props.closeOn === 'clickOutside') {
      return !clickInside
    }
    return
  }

  private get visibleDelegated() {
    return 'visible' in this.props
  }

  private get visible() {
    if (this.props.disabled) return false
    if (this.visibleDelegated) {
      return !!this.props.visible
    } else {
      return this.state.visible
    }
  }

  private changeVisible = (visible: boolean) => {
    visible = this.props.disabled ? false : visible
    if (this.visibleDelegated) {
      if (typeof this.props.onVisibleChange !== 'function') return
      if (this.visible === visible) return
      this.props.onVisibleChange(visible)
    } else {
      this.setState({ visible })
    }
  }

  private getPositionInfo(trigger: HTMLElement, scrollingElement: Element) {
    const rect = trigger.getBoundingClientRect()

    return {
      popoverTop: scrollingElement.scrollTop + rect.bottom,
      popoverLeft: scrollingElement.scrollLeft + rect.left + rect.width / 2,
    }
  }

  private onTriggerClick = () => {
    if (this.props.disabled) return
    if (this.props.openOn !== 'click') return
    if (!document.scrollingElement) return
    if (!this.triggerContainerRef.current) return
    this.setState(
      this.getPositionInfo(
        this.triggerContainerRef.current,
        document.scrollingElement,
      ),
    )
    this.changeVisible(true)
  }

  private onMouseEnter = () => {
    if (this.props.disabled) return
    if (this.props.openOn !== 'hover') {
      if (!this.visible) return
      if (this.props.closeOn !== 'hover') return
    }
    if (!document.scrollingElement) return
    if (!this.triggerContainerRef.current) return
    this.setState(
      this.getPositionInfo(
        this.triggerContainerRef.current,
        document.scrollingElement,
      ),
    )
    this.changeVisible(true)
  }

  private onMouseLeave = () => {
    if (this.props.disabled) return
    if (this.props.closeOn !== 'hover') return
    this.changeVisible(false)
  }
}
