import { storiesOf } from '@storybook/react'
import { Html } from './Html'
import { Portal } from './Portal'
import { getMdStoryCtx } from '../configs/storybook/getMdStoryCtx'
import { Store, State } from '@sambego/storybook-state'
import { withOptions } from '@storybook/addon-options'
import './Portal.stories.scss'

const store = new Store({
  visible: false,
  closeOnClick: false,
  closeOnOutsideClick: false,
})

type StoreState = (typeof store)['state']

const stories = storiesOf('Portal', module)

stories.addDecorator(
  withOptions({ selectedAddonPanel: 'storybook/stories/stories-panel' }),
)

stories.add(
  'base',
  () => {
    const portalContentRef = React.createRef<HTMLDivElement>()

    const showPortal = () => store.set({ visible: true })

    const hidePortal = () => store.set({ visible: false })

    const togglePortal = (visible: boolean) => store.set({ visible })

    const toggleCloseOnClick = () =>
      store.set({ closeOnClick: !store.state.closeOnClick })

    const toggleCloseOnOutsideClick = () =>
      store.set({ closeOnOutsideClick: !store.state.closeOnOutsideClick })

    const wrapWithState = (f: (state: StoreState) => React.ReactNode) => (
      <State store={store}>{f}</State>
    )

    const clickClose = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return
      if (!portalContentRef.current) return
      if (store.state.closeOnClick) {
        return portalContentRef.current.contains(event.target)
      } else if (store.state.closeOnOutsideClick) {
        return !portalContentRef.current.contains(event.target)
      }
      return
    }

    return (
      <div>
        <p>
          <label>
            closeOnClick
            {wrapWithState(state => (
              <input
                type="checkbox"
                checked={state.closeOnClick}
                onChange={toggleCloseOnClick}
              />
            ))}
          </label>
        </p>
        <p>
          <label>
            closeOnOutsideClick
            {wrapWithState(state => (
              <input
                type="checkbox"
                checked={state.closeOnOutsideClick}
                onChange={toggleCloseOnOutsideClick}
              />
            ))}
          </label>
        </p>
        <p>
          <button type="button" onClick={showPortal}>
            Show Portal
          </button>
        </p>
        <State store={store}>
          <Portal onVisibleChange={togglePortal} clickClose={clickClose}>
            {wrapWithState(state => (
              <PortalContent
                contentRef={portalContentRef}
                visible={state.visible}
                onClose={hidePortal}
              />
            ))}
          </Portal>
        </State>
      </div>
    )
  },
  getMdStoryCtx('Portal'),
)

const PortalContent: React.SFC<{
  contentRef: React.RefObject<HTMLDivElement>
  visible: boolean
  onClose: () => void
}> = ({ contentRef, visible, onClose }) => (
  <>
    <Html
      className={
        'PortalContent__root PortalContent__root--' +
        (visible ? 'show' : 'hide')
      }
    />
    <div className="PortalContent__overlay">
      <div ref={contentRef} className="PortalContent__content">
        <p>Portal content</p>
        <p>
          <button type="button" onClick={onClose}>
            Close Portal
          </button>
        </p>
      </div>
    </div>
  </>
)
