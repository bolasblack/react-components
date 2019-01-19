declare module 'react-docgen-typescript-webpack-plugin'
declare module '@storybook/addons'
declare module 'sass'
declare module 'enzyme-adapter-react-16'

declare module 'require-context.macro' {
  const requireContext: typeof require.context
  export default requireContext
}
