#!/bin/bash
# create a new markdown blog post under the convention of 
# /content/post/{timestamp}-{name}/index.md
SLUG=$1
TITLE=$(echo "$SLUG" | tr '-' ' ' | awk '{ for(i=1; i<=NF; i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2)); }1')

mkdir "./src/content/post/$(date +%s)-$SLUG" \
&& cat <<EOF > "$_/index.md"
---
title: '$TITLE' 
slug: '$SLUG'
description: ''
publishDate: $(date +%Y-%m-%d)
tags: []
draft: true
---
EOF