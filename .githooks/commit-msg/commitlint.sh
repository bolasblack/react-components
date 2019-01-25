#!/usr/bin/env bash

res=$(FORCE_COLOR=1 yarn commitlint -e $@)
[ $? -eq 0 ] && exit
echo "$res"
exit 1
