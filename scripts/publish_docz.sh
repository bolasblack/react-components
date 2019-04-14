#!/usr/bin/env bash

PAGES_WORK_TREE="gh-pages"
PAGES_GIT_DIR=".$PAGES_WORK_TREE-git"
PAGES_GIT="git --git-dir=$PAGES_GIT_DIR --work-tree=$PAGES_WORK_TREE"

cd $(git rev-parse --show-toplevel)

if [ ! -d $PAGES_GIT_DIR ]; then
  git clone --bare --depth=1 --branch=gh-pages git@github.com:bolasblack/react-components.git $PAGES_GIT_DIR
fi

$PAGES_GIT fetch origin
$PAGES_GIT reset --hard

yarn
DOCZ_DEST=$PAGES_WORK_TREE DOCZ_BASE="/react-components" yarn docz:build

if [ -n "$($PAGES_GIT status -s)" ]; then
  $PAGES_GIT add -A
  $PAGES_GIT commit -m "$(date --rfc-3339 seconds) $(git show -s --format=%s HEAD)"
  $PAGES_GIT push origin gh-pages
fi
