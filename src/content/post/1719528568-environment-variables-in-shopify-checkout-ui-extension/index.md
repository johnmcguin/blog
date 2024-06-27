---
title: 'Environment Variables In Shopify Checkout Ui Extension'
slug: 'environment-variables-in-shopify-checkout-ui-extension'
description: 'How to set environment variables when developing Shopify Checkout UI Extensions.'
publishDate: 2024-06-27
tags: ['how-to', 'shopify']
draft: false
---

This post refers
[Shopify Checkout UI extensions](https://shopify.dev/docs/api/checkout-ui-extensions). See
[this post](/blog/authenticated-requests-from-shopify-ui-extensions/) for a brief introduction to UI
extensions.

## Problem

One big limitation of the Shopify UI extensions is that there is no native way to use environment
variables, an [important principle](https://12factor.net/config) when making apps. My use case,
which I imagine is a very common one, is providing my frontend extension code with an api endpoint
that will vary across development, staging, and production environments.

## Solution

The solution I landed at is to kind of hack in environment variables into the code during build
time. This will happen by:

- writing a template file with all of your environment variables
- depending on a configuration file in your code which holds your environment variables
- writing a script that creates that runtime file using the template file as a template
- calling that script at build time, setting in your environment variables for the script to consume
- `.gitignore` your runtime file

### Template File

First, create a template file. Place this in your extension's `src` directory. Mine lives at
`src/config/config.template.txt`. The contents are: `export const API_URL = "$API_URL";`. That's it.

### Depend on Config File (Source Code)

In your source code which depends on the environment variable, pull in your exported variable(s)
from a dependency we'll call `config.ts`. This file will live right next to the
`config.template.txt` file. Don't create this, though, the script will. My import looks like:

```typescript
import { API_URL } from './config/config';
```

### Script It

Now that the runtime dependency is in place, we need to write a bash script to create the runtime
dependency and populate it with our environment variables. I put my project scripts in a `scripts`
directory at the root of the project. I gave my script the verbose name
`setup_ui_extension_environment.sh`. It looks like this:

```bash
#!/usr/bin/env bash
# template file
template="extensions/<your-extensions-name-here>/src/config/config.template.txt"
# generated file
config="extensions/<your-extensions-name-here>/src/config/config.ts"
# make sure that the API_URL environment variable is set
if [ -z "${API_URL}" ]; then
    echo -e "\033[0;31mMust set API_URL environment variable"
    exit 1
fi

# generate the runtime file based on the template, using envsubst
envsubst < "$template" > extensions/<your-extensions-name-here>/src/config/config.ts
# output what you did
echo -e "\033[0;32mWrote $API_URL as API_URL from $template to $config"

```

API_URL is my only environment variable at the moment, but you can imagine extending this to support
many others.

### Invoke The Script

This manual will only cover development, but the concepts apply across environments and deployments.
Make sure to invoke this script when you are building your extension code. My new `package.json`
`dev` command looks like this:

```json
"scripts": {
    "dev": "API_URL=https://my-app.ngrok-free.app npm run env:setup && npm run config:use dev && shopify app dev",
    "env:setup": "./scripts/setup_ui_extension_environment.sh"
}
```

Don't mind the extra config instructions, the important bit is to:

- set the environment variable (i.e. API_URL=https://my-app.ngrok-free.app)
- invoke the script (i.e. npm run env:setup)
- before running the shopify dev environment (i.e. shopify app dev)

### .gitignore it

It's generally prudent to `.gitignore` generated files. We don't want to commit this because we it
will vary across environments, and maybe even developers on your team, etc. It's a build time
concern only.
