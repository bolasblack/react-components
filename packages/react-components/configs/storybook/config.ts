import { configure, addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { withOptions } from '@storybook/addon-options'
import { withKnobs } from '@storybook/addon-knobs'
import requireContext from 'require-context.macro'

if (process.env.NODE_ENV !== 'test') {
  addDecorator(withInfo({ inline: true }))
}

addDecorator(
  withOptions({ selectedAddonPanel: 'storybooks/storybook-addon-knobs' }),
)

addDecorator(withKnobs)

const req = requireContext('../../src', true, /\.stories\.tsx$/)

configure(() => req.keys().forEach(req), module)
