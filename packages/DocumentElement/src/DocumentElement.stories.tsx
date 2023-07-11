import * as React from 'react'
import { useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { DocumentElement } from './DocumentElement'

export default {
  title: 'Components/DocumentElement',
  component: DocumentElement,
} satisfies Meta<typeof DocumentElement>

export const BasicUsage: StoryFn = () => {
  const [color, changeColor] = useState('blue')

  return (
    <DocumentElement
      className="root-class-name"
      style={{ '--font-color': 'black' }}
    >
      <DocumentElement style={{ '--font-color': color }} />
      <label>
        Choose text color:
        <select value={color} onChange={e => changeColor(e.target.value)}>
          {['green', 'blue', 'yellow'].map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </label>
      <div style={{ color: 'var(--font-color)' }}>Some text</div>
    </DocumentElement>
  )
}
