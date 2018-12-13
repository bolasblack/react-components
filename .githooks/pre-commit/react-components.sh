#!/usr/bin/env bash

if [ `git status --porcelain | grep 'react-components/' | wc -l` -eq 0 ]; then
  exit
fi

cd packages/react-components
yarn lint-staged
