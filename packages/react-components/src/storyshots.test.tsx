import path from 'path'
import initStoryshots from '@storybook/addon-storyshots'

jest.mock('react-dom', () => ({
  createPortal: (node: any) => <div data-create-portal={true}>{node}</div>,
}))

initStoryshots({
  configPath: path.resolve(__dirname, '../configs/storybook'),
})
