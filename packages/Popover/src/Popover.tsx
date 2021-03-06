import * as React from 'react'
import { Portal } from '@c4605/react-portal'
import { SimpleJSON } from '@c4605/ts-types'

export interface PopoverVisibleInfo {
  visible: boolean

  popoverTop: number
  popoverLeft: number
}

export type PopoverStyle = React.CSSProperties & SimpleJSON

export interface PopoverVisibleChangeReason {
  event?: Event
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
  popoverStyle: (info: PopoverVisibleInfo) => PopoverStyle
  /** Popover open cause */
  openOn: 'hover' | 'click'
  /** Popover close cause */
  closeOn: 'hover' | 'click' | 'clickInside' | 'clickOutside'
  /** Popover visiblity */
  visible?: boolean
  /** Callback when popover visiblity needs to be changed */
  onVisibleChange: (
    visible: boolean,
    reason: PopoverVisibleChangeReason,
  ) => void
  /** If set to true, popover won't be shown, popoverStyle, content, onVisibleChange won't be called */
  disabled: boolean
  /** Set to true to render content inline */
  inline: boolean
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
  static displayName = 'Popover'

  static get popoverContainer(): HTMLElement | null {
    return popoverContainer
  }

  static defaultProps = {
    triggerClassName: '',
    popoverClassName: '',
    openOn: 'hover' as const,
    closeOn: 'hover' as const,
    disabled: false,
    inline: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onVisibleChange: /* istanbul ignore next */ () => {},
    popoverStyle: (info: PopoverVisibleInfo): PopoverStyle => ({
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

  render(): JSX.Element {
    return (
      <>
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
          className={`Popover__container ${this.props.popoverClassName}`}
          style={this.popoverStyle()}
          parent={this.getPopoverParent()}
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
      </>
    )
  }

  private getPopoverParent(): null | HTMLDivElement {
    if (this.props.inline) return null

    if (!popoverContainer) {
      popoverContainer = document.createElement('div')
      document.body.appendChild(popoverContainer)
    }

    return popoverContainer
  }

  private popoverStyle(): undefined | PopoverStyle {
    if (this.props.disabled) return
    // istanbul ignore next
    if (!document.scrollingElement) return
    // istanbul ignore next
    if (!this.triggerContainerRef.current) return
    return this.props.popoverStyle({
      visible: this.visible,
      ...this.getPositionInfo(
        this.triggerContainerRef.current,
        document.scrollingElement,
      ),
    })
  }

  private clickClose = (event: MouseEvent): undefined | boolean => {
    // istanbul ignore next
    if (!this.triggerContainerRef.current) return
    // istanbul ignore next
    if (!this.contentContainerRef.current) return
    // istanbul ignore next
    if (!(event.target instanceof HTMLElement)) return

    if (this.props.closeOn === 'click') {
      return true
    }

    const clickInside =
      this.triggerContainerRef.current.contains(event.target) ||
      this.contentContainerRef.current.contains(event.target)
    if (this.props.closeOn === 'clickInside') {
      return clickInside
    } else if (this.props.closeOn === 'clickOutside') {
      return !clickInside
    }

    // istanbul ignore next
    return
  }

  private get visibleDelegated(): boolean {
    return 'visible' in this.props
  }

  private get visible(): boolean {
    if (this.props.disabled) return false
    if (this.visibleDelegated) {
      return !!this.props.visible
    } else {
      return this.state.visible
    }
  }

  private changeVisible = (
    visible: boolean,
    reason: PopoverVisibleChangeReason,
  ): void => {
    // istanbul ignore next
    visible = this.props.disabled ? false : visible
    if (this.visibleDelegated) {
      // istanbul ignore next
      if (this.visible === visible) return
      this.props.onVisibleChange(visible, reason)
    } else {
      this.setState({ visible })
    }
  }

  private getPositionInfo(
    trigger: HTMLElement,
    scrollingElement: Element,
  ): Pick<PopoverState, 'popoverTop' | 'popoverLeft'> {
    const rect = trigger.getBoundingClientRect()

    return {
      popoverTop: scrollingElement.scrollTop + rect.bottom,
      popoverLeft: scrollingElement.scrollLeft + rect.left + rect.width / 2,
    }
  }

  private onTriggerClick = (event: React.MouseEvent): void => {
    if (this.props.disabled) return
    if (this.props.openOn !== 'click') return
    // istanbul ignore next
    if (!document.scrollingElement) return
    // istanbul ignore next
    if (!this.triggerContainerRef.current) return
    this.setState(
      this.getPositionInfo(
        this.triggerContainerRef.current,
        document.scrollingElement,
      ),
    )
    this.changeVisible(true, { event: event.nativeEvent })
  }

  private onMouseEnter = (event: React.MouseEvent): void => {
    if (this.props.disabled) return
    if (this.props.openOn !== 'hover') return
    // istanbul ignore next
    if (!document.scrollingElement) return
    // istanbul ignore next
    if (!this.triggerContainerRef.current) return
    this.setState(
      this.getPositionInfo(
        this.triggerContainerRef.current,
        document.scrollingElement,
      ),
    )
    this.changeVisible(true, { event: event.nativeEvent })
  }

  private onMouseLeave = (event: React.MouseEvent): void => {
    // istanbul ignore next
    if (this.props.disabled) return
    if (this.props.closeOn !== 'hover') return
    this.changeVisible(false, { event: event.nativeEvent })
  }
}
