---
title: 'Github Actions Dynamic Matrix'
slug: 'github-actions-dynamic-matrix'
description: 'Creating a matrix dynamically for a GitHub Action job'
publishDate: 2024-08-23
tags: ['git', 'devops']
draft: false
---

From the jump I should call out that I'm not a DevOps professional. There are quite possibly dragons
in this solution; I may have done things weirdly. But, it worked well for me, and I'd like to share
it for posterity and my own future reference. If you just want to consult the end solution, you can
find that [here](https://github.com/johnmcguin/unicorn/blob/main/.github/workflows/publish.yml).

## Problem

I am working on a template repo called [unicorn](https://github.com/johnmcguin/unicorn) that is
designed to make it easier to deploy websites alongside job applications. It is a monorepo to house
many [Astro](https://astro.build) websites with the same template and UI. The
[initial iteration](https://github.com/johnmcguin/unicorn/commit/26386fefa8458b09174e226e26ded63fcb9dfb2e#diff-551d1fcf87f78cc3bc18a7b332a4dc5d8773a512062df881c5aba28a6f5c48d7)
of the workflow simply used a matrix for the deployment jobs. This works perfectly well, but in
practice, as I've used the template in my own job hunt, in a matter of a couple of weeks I already
have a fairly large number of sites deployed. In this iteration, every website is deployed on every
push to main. These are fairly quick jobs, but there is no need to run them. Better to save compute
and energy and to only deploy the sites that are changed.

## High level solution

At a high level, the solution is to maintain a mapping of monorepo packages (the name of the
directory found in `sites/<site>`) to Pages projects. The workflow will need to reference this
configuration, whether it is expressed in the `yml` file itself or in a configuration file. The
workflow will also need to determine what has changed. If just a site was changed, it should just
deploy that site. If the common UI package has changed, then all sites should get deployed, for
example. The workflow now has an additional job called "prepare". Prepare will prepare the matrix
and the "publish" job will depend on its outputs. So the workflow should: check changes -> compare
changes to full configuration sites -> deploy relevant sites.

## Configuration

This is the area that I am most curious if I ended up with a weird solution. The job needs a mapping
of package names (the directory) to the name of the Cloudflare Pages project. These could differ and
should not be tied together, but at the end of the day, we need to know how to map a certain
directory to a Pages project. I am unsure if there is a more native way to do this within the
workflow syntax, but I could not determine it. I ended up using a JSON file `sites.json` for the
users to configure this mapping. This is accomplished by
[adding a step](https://github.com/johnmcguin/unicorn/blob/main/.github/workflows/publish.yml#L16)
in the "prepare" job that reads the
[sites.json](https://github.com/johnmcguin/unicorn/blob/main/sites.json) file and sets it as an
environment variable to `$GITHUB_ENV`. In the `sites.json`, the keys are the directory names and the
values are the Pages project names.

## Determine changes

To determine the changes, you could do this a number of ways, but the method I landed on was to use
an existing action called [paths-filter](https://github.com/dorny/paths-filter) from GitHub user
[dorny](https://github.com/dorny). Thanks dorny! This had a nice API and it's nice to have less code
to parse and grok. I won't go into a detailed description of the action here, but the
[new step](https://github.com/johnmcguin/unicorn/blob/main/.github/workflows/publish.yml#L18-L30)
organizes git changes to be returned by user specified filters that can be queried to help develop
logic flows in your pipelines. Here, I am querying by dependency changes and core UI package changes
which would require re-deploying all sites. Otherwise, there will be 0 to many deployments based on
whether sites have changed or not.

There was one feature I was kinda missing / hoping for with paths-filter and that was to specify
what type of data to return for the filters. For example, for the sites filter, I am only really
concerned with the immediate children of sites. I don't _think_ there was a way to do this, so I did
write a
[follow up step](https://github.com/johnmcguin/unicorn/blob/main/.github/workflows/publish.yml#L32-L43)
which takes the outputs from paths-filter and sets a new environment variable to `$GITHUB_ENV` which
is the unique sites changed, only the directory of the site.

## Script building the matrix

To recap, we now have the user configured sites that they want to deploy, the unique sites that have
changed from a git perspective, and a nice workflow API to check if sites have changed,
dependencies, or core packages have changed. With all this in place, we can write a script that can
build the matrix of sites to deploy. I am not very good with bash scripting, so I wrote a node
script instead. The
[build dynamic matrix](https://github.com/johnmcguin/unicorn/blob/main/.github/workflows/publish.yml#L45-L57)
step checks the output of paths-filter and calls the node script to build the matrix for all sites
if deps OR core packages have changed. If sites have changed, build a matrix for only the target
sites. If neither is true, then do not run the script and simply set "continue" to false. "Continue"
is an output of the job for the publish job to consult. As I understand it, there is no native way
in the workflow syntax to say "this was successful, but don't continue the rest of the pipeline".
Hence, the explicit "continue" output. The script that builds the matrix is
[here](https://github.com/johnmcguin/unicorn/blob/main/scripts/build_matrix.mjs), but the gist is
that it needs to return the matrix data for the publish job. It leverages the
[include syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrixinclude)
for a matrix job.

## Outcome

What we now have is a workflow that can publish only the sites that need to be deployed. If not, it
will exit successfully after the prepare job and the workflow will not run the publish job. This is
exactly what we were hoping for. I found this to be a really good little project to expand my
knowledge of GitHub Actions. Hopefully you've found this to be a little helpful in your own Actions
adventures as well.
