---
title: 'Better Navigation Experience With ZSH cdpath Variable'
slug: 'better-navigation-zsh-cdpath'
description: 'Shell enhancements for a better `cd` experience with ZSH cdpath environment variable'
publishDate: 2024-01-10
tags: ['recipe', 'zsh']
draft: true
---

In *nix systems, the `cd` command lets us navigate the filesystem. There are a few places that I visit most frequently though.
For me, it's my `Projects` directory, my `Brain` directory (obsidian), and then a `Playground` directory is where I throw experimentation
or throw away code. That, and my `$HOME`. You can add or experiment with these changes and they can be added to your `.zshrc` or `.bashrc`.

## Aliases
I use these aliases as navigation helpers to go backward in the filesystem.
```bash
alias ..="cd .."
alias ..2="cd ../.."
alias ..3="cd ../../.."
alias ..4="cd ../../../.."
```
They should be pretty straight forward, but these basically say go backward `..` n levels. Of course it's
just hard coded but I'm never really needing much more than that. In combination with the cdpath modification,
system navigation becomes beautiful 🤌.

## cdpath OR $CDPATH
In linux, when a `cd` gets executed, the $CDPATH environment variable is consulted. The $CDPATH is similar to the
$PATH variable in structure and behavior. If it's not set explicitly, the behavior just defaults to operating from
the current directory. However, you can customize it for much prosperity, good fortune, and good times. I use
ZSH so my example will use ZSH's cdpath which takes a list instead of a string, but the example can be easily
modified to bash or your shell of choice.
```bash
cdpath=(. $HOME $HOME/Projects $HOME/Brain $HOME/Playground)
```
This extends the cdpath to include all of these additions. What this means in practice is that I can still
have normal cd behavior from the current directory, but I can also `cd` directly into anything in any of the
other paths. For example, if I have a project at `$HOME/Projects/blog`, from anywhere on the system, I can
`cd blog`, or I could `cd Projects/blog`.
