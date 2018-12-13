import { storiesOf } from '@storybook/react'
import { withKnobs, select } from '@storybook/addon-knobs'
import { Html } from './Html'
import { getMdStoryCtx } from '../configs/storybook/getMdStoryCtx'

const stories = storiesOf('Html', module)

stories.addDecorator(withKnobs)

stories.add(
  'base',
  () => {
    const fontColor = select(
      'font-color',
      ['#0366d6', '#34d058', '#e36209'],
      '#0366d6',
    )

    return (
      <Html className="root-class-name" style={{ '--font-color': '#333' }}>
        <Html style={{ '--font-color': fontColor }}>
          <div style={{ color: 'var(--font-color)' }}>Some text</div>
        </Html>
      </Html>
    )
  },
  getMdStoryCtx('Html'),
)
