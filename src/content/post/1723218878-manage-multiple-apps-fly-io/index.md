---
title: 'Managing Multiple Apps On Fly.io'
slug: 'manage-multiple-apps-fly-io'
description: 'How to manage multiple applications on Fly.io'
publishDate: 2024-08-09
tags: ['recipe', 'elixir']
draft: false
---

**TLDR;** remove the `app` key in `fly.toml` to get prompted to select the application when running
fly commands that depend on an application.

There is a time and a place for running your own VPS or VPC, but when I am in the mode of wanting to
focus on writing and shipping application code as a solo developer, I don't think there is anything
wrong with using a PaaS. The platform I've been reaching for recently is [fly.io](https://fly.io). I
was initially drawn to check out fly because they're an Elixir shop (😍). I was impressed by the
offering. While I don't use their database services, for deploying applications, they've struck a
really nice balance of simplicity and power. Further, by deploying with docker based Elixir / BEAM
releases, I should be able to fairly easily port this to a different cloud environment or VPS
without too much fuss.

As with any tech you are new to, the surface area of the product and APIs can at times be
overwhelming. As a new user with many apps on Fly, I was bit by accidentally running commands
against the wrong application a few times, leading to unwanted releases, unwanted scaling, etc, or
at worst, broken releases. While the ability to deploy, provision, etc, directly from the command
line is a powerful tool for the solo developer, it's not without it's drawbacks. You have to be
careful. There are numerous commands that I wish for a `--dry-run` flag, or that they would provide
a confirmation stage before execution.

My first workaround was to write bash scripts for my projects that wrapped the `fly` commands I
wanted to be extra careful with. These scripts would require an environment name, or application
name, for example. This worked fine, but it both required being written and also required me and any
future developers on the project to use this script for deployments. Maybe not a big deal once
integrated in CD automations, but still more open to error than is desirable. There was a simpler,
more error proof, more blessed path that I didn't initially know about. That solution is to simply
remove the `app` key from the `fly.toml` file. Now, when you execute `fly` commands that require an
application to run against, the cli will prompt you for the application before it executes.
