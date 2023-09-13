#!/bin/bash
# create a new markdown blog post under the convention of 
# /content/post/{timestamp}-{name}/index.md
SLUG=$1

mkdir "./src/content/post/$(date +%s)-$SLUG" \
&& cat <<EOF > "$_/index.md"
---
title: '$SLUG'
slug: '$SLUG'
description: ''
publishDate: $(date +%Y-%m-%d)
tags: []
draft: true
---
EOF