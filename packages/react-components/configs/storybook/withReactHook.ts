export const withReactHook = (Component: any) =>
  React.createElement(Component) as React.ComponentClass<{}, any>
