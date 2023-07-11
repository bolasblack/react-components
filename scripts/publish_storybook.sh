#!/usr/bin/env bash

SCRIPT_DIR="$(dirname $0)"
. "$SCRIPT_DIR"/mo

PAGES_WORK_TREE="gh-pages"
PAGES_GIT_DIR=".$PAGES_WORK_TREE-git"
PAGES_GIT="git --git-dir=$PAGES_GIT_DIR --work-tree=$PAGES_WORK_TREE"

cd $(git rev-parse --show-toplevel)

if [ ! -d $PAGES_GIT_DIR ]; then
  git clone --bare --depth=1 --branch=gh-pages git@github.com:bolasblack/react-components.git $PAGES_GIT_DIR
fi

$PAGES_GIT fetch origin

$PAGES_GIT reset --hard

pnpm install
STORYBOOK_BASE="/react-components" pnpm storybook:build --output-dir "$PAGES_WORK_TREE"

MO_DATA__EXCLUDES=( $(cd "$PAGES_WORK_TREE" && find ./ -iname "_*") )
cat configs/jekyll.yml | mo > gh-pages/_config.yml

if [ -n "$($PAGES_GIT status -s)" ]; then
  $PAGES_GIT add -A
  $PAGES_GIT commit -m "$(date --rfc-3339 seconds) $(git show -s --format=%s HEAD)"
  $PAGES_GIT push origin gh-pages
fi
