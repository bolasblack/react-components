import * as React from 'react'
import { useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { Popover } from './Popover'

export default {
  title: 'Components/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>

export const BasicUsage: StoryFn = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Popover
      visible={visible}
      onVisibleChange={setVisible}
      trigger={() => <p style={{ background: '#ddd' }}>Trigger</p>}
      content={() => (
        <p
          style={{
            position: 'relative',
            margin: 0,
            width: '300px',
            height: '100px',
            background: '#eaeaea',
          }}
        >
          Content
        </p>
      )}
    />
  )
}
