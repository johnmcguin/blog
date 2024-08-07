---
title: 'Unicorn'
slug: 'unicorn'
description:
  'Unicorn is a monorepo template that helps you quickly deploy a static website for every job
  application.'
publishDate: 2024-08-07
tags: ['how-to', 'astro']
draft: false
---

Introducing [Unicorn](https://github.com/johnmcguin/unicorn), a monorepo template built on GitHub
Actions and Cloudflare to help you stand out in your job applications by deploying a static site for
each job application.

## Create repo

First, you'll need to clone the template repository to your own, working repository.

![Use Template](./template.png)

## Clone into repo

Next, clone your new repository to your local dev machine. Documenting this step is out of scope for
this post but well documented online or on GitHub.

## Local edits

The template repository provides the skeleton structure for a nice job application workflow, but it
will not work out of the box. You need to do a couple of things to make this project work for you.
First, you'll want to rename the `sites/unicorn-demo` directory to your own site. Make sure to
update the package name in the `package.json` file as well. If you do a project wide search for
'unicorn-demo', this should give you a list to work through and update. One of the updates will be
the GitHub Action workflow found in `.github/workflows/publish.yml`. This workflow is the root of
the template. At the heart of it is the
[matrix property](https://github.com/johnmcguin/unicorn/blob/main/.github/workflows/publish.yml#L9-L20),
which declares a mapping of local directories to project names in Cloudflare. We'll explain this in
further detail later (LINK).

With these changes in place, do an `npm install` at the root of the repo and try to run your new
website by running

```bash
npm run dev -w ./sites/<your-site>
```

## Deployment

You've developed your website and are ready to deploy it. First, either create or login to your
Cloudflare account. In your Cloudflare account, navigate to "Profile" -> "API Tokens" -> "Create
Token". Under the "Custom token" section, click to create a custom token. Give the token a name and
the edit permission to Cloudflare Pages. Copy this token and navigate to your GitHub repository. Add
a GitHub secret named 'DEPLOY_TOKEN', pasting the token from the previous step as the value. Add
another secret called 'CLOUDFLARE_ACCOUNT_ID'. Obtain the value for this from the Cloudflare
dashboard. Navigate to the "Workers and Pages" section in your Cloudflare account. You should be
able to copy the account id from the sidebar of this web page. The workflow will use these secrets
to deploy your websites to your Cloudflare account.

While in the Cloudflare dashboard, create your first site. Navigate to "Workers and Pages". Select
"create application". Select "Pages" tab. Select "Create using direct upload". Select "Upload
assets", although we will be skipping the actual upload of assets (the GH action workflow will do
this for us, we just need to create the pages "project" at this point). Give the project a name, and
select "Create project" without uploading assets. Take note of the project name you provided. Update
the GitHub action's matrix property with this value. You should update the 'project' key.

At this point, everything should be setup for a deployment to succeed. To test this out, push your
working repository to the GitHub remote and watch the action run.

## DNS

DNS is out of scope for this post. For my own job applications, I use Cloudflare name servers and
deploy each website as a subdomain to a personal TLD, which works quite well.

_If you have any issues following this post, please open an issue on GitHub._
