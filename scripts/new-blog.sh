#!/bin/bash
# create a new markdown blog post under the convention of 
# timestamp (seconds from unix epoch)-name (1st argument) to the script
mkdir "./src/content/post/$(date +%s)-$1" && touch "$_/index.md"