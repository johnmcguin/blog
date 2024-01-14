---
title: 'Time Travel Directories'
slug: 'directory-time-travel'
description: 'A ZSH function to time travel to your most recent directories.'
publishDate: 2024-01-14
tags: ['zsh', 'recipe']
draft: false
---

The first time I saw somebody use `cd -` my mind was blown. If it's new to you, `cd -` will change
to your previous directory. The shell is tracking a stack of recent directories, which can be seen
via the builtin `dirs` command. You can also directly interface with the directory stack via `pushd`
and `popd`. This is so cool and it's the backing mechanism that `cd -` uses. With that new
knowledge, I created a small zsh function to help me time travel to any directory on the stack,
instead of just the most recent.

```bash
function travel() {
    local options=()
    while read -r dir; do
        options+=("$dir")
    done < <(dirs -p)

    select dir in "${options[@]}"; do test -n "$dir" && break; echo "Invalid Selection"; done
    eval cd "$dir"
}
```

When this function gets invoked, you're prompted to select an option from the directories on the
stack and it will navigate back to it.
