import { storiesOf } from '@storybook/react'
import { Popover } from './Popover'
import { getMdStoryCtx } from '../configs/storybook/getMdStoryCtx'
import { select, number, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

const stories = storiesOf('Popover', module)

stories.add(
  'base',
  () => {
    const appearDelay = number('appearDelay (ms)', 0)
    const disappearDelay = number('disappearDelay (ms)', 0)

    return (
      <div>
        <Popover
          popoverStyle={info => ({
            ...(Popover.defaultProps.popoverStyle(info) as any),
            transition: 'visibility, top, left',
            transitionDelay: info.visible
              ? `${appearDelay / 1000}s`
              : `${disappearDelay / 1000}s`,
          })}
          openOn={select('openOn', ['hover', 'click'], 'hover')}
          closeOn={select(
            'closeOn',
            ['hover', 'clickOutside', 'clickInside'],
            'hover',
          )}
          trigger={() => <p style={{ background: '#ddd' }}>Trigger</p>}
          content={() => (
            <p
              style={{
                position: 'relative',
                margin: 0,
                width: '300px',
                height: '300px',
                background: '#eaeaea',
              }}
            >
              Popover Content
            </p>
          )}
        />
      </div>
    )
  },
  getMdStoryCtx('Popover'),
)

stories.add(
  'State Up',
  () => {
    return (
      <div>
        <Popover
          visible={boolean('visible', false)}
          onVisibleChange={action('onVisibleChange')}
          openOn="click"
          closeOn="clickOutside"
          trigger={() => <p style={{ background: '#ddd' }}>Trigger</p>}
          content={() => (
            <p
              style={{
                position: 'relative',
                margin: 0,
                width: '300px',
                height: '300px',
                background: '#eaeaea',
              }}
            >
              Popover Content
            </p>
          )}
        />
      </div>
    )
  },
  getMdStoryCtx('Popover'),
)
