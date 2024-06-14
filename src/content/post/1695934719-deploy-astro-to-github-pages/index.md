---
title: 'Deploy Astro To Github Pages'
slug: 'deploy-astro-to-github-pages'
description: 'Learn how to deploy your astro project to GitHub Pages on a custom subdomain'
publishDate: 2023-09-28
tags: ['recipe', 'astro']
draft: false
---

If you are using GitHub to host a public repository, deploying your static Astro site onto GitHub
Pages is a quick and easy option to getting your site online.

## Create DNS Entry

First, you'll want to add a DNS entry for your subdomain. To do this, navigate to your DNS
management dashboard for your domain name and add a new CNAME record where the host name is of the
format `<your-subdomain>` and the entry type is `CNAME`. You should be mapping this to the canonical
name of `<your-github-username>.github.io`. From the DNS side of things, you should be good to go.

## Astro Configuration

Moving into the astro project, next you'll want to open your `astro.config.ts` file and add a `site`
property to your config object such that you have

```typescript
export default defineConfig({
	site: 'https://<your-full-domain>',
});
```

## GitHub Configuration

To get the deployment ready from the GitHub side of things, navigate to your repository ->
'Settings' -> 'Pages'. Under the "Build and deployment" section, make sure to select "GitHub
actions". Under the "Custom domain" section enter your full domain less the scheme. As an example,
instead of `https://<your-sub>.<your-second-level>.<your-top-level>` instead write
`<your-sub>.<your-second-level>.<your-top-level>`. GitHub will run a DNS check but since we have
already created the CNAME record, expect this to pass. If this does not pass, double check the
previous steps.

## Deployment

The final step is to configure a GitHub Action to deploy the project. GitHub Actions is a powerful
CI/CD tool build directly into GitHub. It is a deep subject unto itself, but at a high level,
specific repo `Events` can trigger `Workflows`. A `Workflow` is process composed of one or many
`Jobs`. In this case, the thing we want to do is kick off a pages deployment. GitHub Actions
workflows are defined in `.github/workflows` directory, so if this doesn't exist, be sure to create
it now. Then create a new file in this directory called `deploy.yml`. In it, paste the following:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v3
      - name: Install, build, and upload your site
        uses: withastro/action@v0
        with:
          node-version: 18

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

What this does is runs a deployment workflow on the `push` event to the branch `main`. It utilizes
existing actions and composes them together to build the project and upload it to github pages. From
here, you should be all set. Pushes to `main` should now deploy your astro website to your custom
subdomain.
