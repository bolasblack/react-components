#!/usr/bin/env bash

if ! git status --porcelain | grep 'tLens/'; then
  exit
fi

cd packages/tLens
yarn lint-staged
