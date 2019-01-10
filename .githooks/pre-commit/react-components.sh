#!/usr/bin/env bash

if ! git status --porcelain | grep 'react-components/'; then
  exit
fi

cd packages/react-components
yarn lint-staged
