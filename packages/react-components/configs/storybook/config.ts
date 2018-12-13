import { configure, addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { withOptions } from '@storybook/addon-options'

addDecorator(withInfo({ inline: true }))

addDecorator(withOptions({ addonPanelInRight: true }))

const req = require.context('../../src', true, /\.stories\.tsx$/)

configure(() => req.keys().forEach(req), module)
