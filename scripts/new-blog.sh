#!/bin/bash
# create a new markdown blog post under the convention of 
# /content/post/{timestamp}-{name}/index.md
mkdir "./src/content/post/$(date +%s)-$1" && touch "$_/index.md"