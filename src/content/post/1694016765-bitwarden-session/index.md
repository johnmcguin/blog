---
title: 'Establish A Session With The Bitwarden CLI'
slug: 'bitwarden-session'
description: 'Learn how to establish a logged in session with the bitwarden CLI.'
publishDate: 2023-09-07
tags: ['recipe', 'cli', 'zsh']
draft: false
---

# Establish A Session With The Bitwarden CLI

Create a Bitwarden session in the terminal with one command:
```bash
export BW_SESSION=$(bw unlock --raw)
```
