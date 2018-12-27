import { configure, addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { withOptions } from '@storybook/addon-options'
import { withKnobs } from '@storybook/addon-knobs'

addDecorator(withInfo({ inline: true }))

addDecorator(
  withOptions({ selectedAddonPanel: 'storybooks/storybook-addon-knobs' }),
)

addDecorator(withKnobs)

const req = require.context('../../src', true, /\.stories\.tsx$/)

configure(() => req.keys().forEach(req), module)
