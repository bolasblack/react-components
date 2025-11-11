# @c4605/react-components [![Coverage Status](https://coveralls.io/repos/github/bolasblack/react-components/badge.svg?branch=master)](https://coveralls.io/github/bolasblack/react-components?branch=master) [![Netlify Status](https://api.netlify.com/api/v1/badges/959b0ca3-36af-424d-b710-0f596303ff03/deploy-status)](https://react-components.c4605.com/)

Some useful react components.

## Components

- [Portal](https://react-components.c4605.com/?path=/docs/components-portal--readme) ([README.mdx](./packages/Portal/README.mdx)): Strong enough [`React.createPortal`](https://reactjs.org/docs/react-dom.html#createportal) replacement. Make most `React.createPortal` use case easier.
- [Popover](https://react-components.c4605.com/?path=/docs/components-popover--readme) ([README.mdx](./packages/Popover/README.mdx)): Powerful and highly customizable popover component, can adapt to most use case.
- [Modal](https://react-components.c4605.com/?path=/docs/components-modal--readme) ([README.mdx](./packages/Modal/README.mdx)): A simple modal component. Provide react hook `useModal`.

## Hooks

- [useAsync](https://react-components.c4605.com/?path=/docs/library-use-async-useasync--readme) ([README.mdx](./packages/useAsync/README.mdx)): Hooks for loading data and handling asynchronous operations. Includes `useAsync` for automatic data loading and `useAsyncFnFactory` for manual control.

## Deprecated Components

- [DocumentElement](https://react-components.c4605.com/?path=/docs/components-documentelement--readme) ([README.mdx](./packages/DocumentElement/README.mdx)): ⚠️ **DEPRECATED** - Provides a declarative way to specify `document.documentElement` attributes in a single-page app. Please use [react-helmet-async](https://github.com/staylor/react-helmet-async) instead.

## Documention

- https://react-components.c4605.com/
- or read `README.mdx` in `packages/`;
- or execute `pnpm install && pnpm storybook` to run a [storybook](https://storybook.js.org/) server.

## Unit test

### Run unit test

```
pnpm test
```

### Run unit test in watch mode

1. `pnpm test:watch`

## Release

1. `cp .envrc.example .envrc`
1. Edit `.envrc`
1. Install [direnv](https://direnv.net/)
1. `direnv allow`
