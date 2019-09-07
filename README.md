# @c4605/react-components [![Build Status](https://travis-ci.com/bolasblack/react-components.svg?branch=master)](https://travis-ci.com/bolasblack/react-components) [![Coverage Status](https://coveralls.io/repos/github/bolasblack/react-components/badge.svg?branch=master)](https://coveralls.io/github/bolasblack/react-components?branch=master) [![Netlify Status](https://api.netlify.com/api/v1/badges/959b0ca3-36af-424d-b710-0f596303ff03/deploy-status)](https://react-components.c4605.com/)

Some useful react components.

- [DocumentElement](https://react-components.c4605.com/document-element-readme) ([README.mdx](./packages/DocumentElement/README.mdx)): Provides a declarative way to specify `document.documentElement` attributes in a single-page app.
- [Portal](https://react-components.c4605.com/portal-readme) ([README.mdx](./packages/Portal/README.mdx)): Strong enough [`React.createPortal`](https://reactjs.org/docs/react-dom.html#createportal) replacement. Make most `React.createPortal` use case more easier.
- [Popover](https://react-components.c4605.com/popover-readme) ([README.mdx](./packages/Popover/README.mdx)): Powerful and highly customizable popover component, can adapt to most use case.
- [Modal](https://react-components.c4605.com/modal-readme) ([README.mdx](./packages/Modal/README.mdx)): A simple modal component. Provide react hook `useModal`.

## Documention

* https://react-components.c4605.com/
* or read `README.mdx` in `packages/`;
* or execute `yarn && yarn docz:dev` to generate [docz](https://github.com/pedronauck/docz).

## Unit test

### Run unit test

```
yarn test
```

### Run unit test in watch mode

1. Install [watchman](https://facebook.github.io/watchman/)
1. `yarn test --watch`
