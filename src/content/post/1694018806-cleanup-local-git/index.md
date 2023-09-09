---
title: 'Cleanup Local Git Branches'
slug: 'cleanup-local-git'
description: 'Learn how to clean up your local git branches for a given project.'
publishDate: 2023-09-09
tags: ['recipe', 'git']
draft: false
---

If you've been developing on a project for a while, you are probably aggregating an ungodly amount of git branches locally. Here is a one liner to cleanup your merged branches:

```bash
git branch --merged origin/master | grep -v 'master' | xargs git branch -d
```
If your trunk / target branch is different, you can modify the command as needed, replacing the occurrences of `master` with your target branch. Let's step through the commands and see how they compose together.

## List Merged Branches
Here we're interested in local branches which have been merged into our production branch on the remote git repository.
```bash
git branch --merged origin/master
continuous-deployment
master
pg-migrate
```
`continuous-deployment` and `pg-migrate` are two feature branches that I still have locally even though they are now in production. `master` is my local copy of master, which I am happy to keep, which leads us into step 2, filtering out the branch(es) you want to keep.

## Filter The Results
I want to keep my local copy of `master`. To do so, we can leverage `grep` with the `-v` flag to do an inverse match on `master`. We are saying to match on everything _except_ `master`. By using the unix pipe operator (`|`) we can chain the two commands together. Briefly explained, a unix pipe takes the standard output (stdout) of one command and pipes it in as the standard input (stdin) of another. So we are executing `grep -v 'master'` against the output of:
```bash
continuous-deployment
master
pg-migrate
```
which gives the results:
```bash
continuous-deployment
pg-migrate
```
Everything but `master`. Perfect!

## Delete The Branches
The final piece of the puzzle is to pipe these new results into `xargs git branch -d`. To delete a local git branch we can run
```bash
git branch -d <your-branch>
```
so this is the meat and potatoes of our final command. Since the stdout that we are currently working with is a list where each git branch is on a new line, we can use `xargs` to allow us to execute `git branch -d` for each item (branch) in that list. What this looks like under the hood is:
```bash
git branch -d continuous-deployment
git branch -d pg-migrate
```

## Piecing It All Together
Putting all the pieces together and executing the one liner
```bash
git branch --merged origin/master | grep -v 'master' | xargs git branch -d
```
we get
```bash
Deleted branch continuous-deployment (was 86cfe6d).
Deleted branch pg-migrate-cleanup (was 433f4d6).
```
As you can see, each local branch was deleted - just what we were hoping for. Hopefully that will help keep your local repositories a little bit cleaner. This could also easily become a shell function for convenience's sake but I'll leave that as an exercise for the reader.
