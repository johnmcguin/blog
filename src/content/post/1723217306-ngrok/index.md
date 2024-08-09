---
title: 'Configuring Ngrok With A Static Domain'
slug: 'ngrok-config'
description: 'Configure custom ngrok commands to serve static domains'
publishDate: 2024-08-09
tags: ['how-to']
draft: false
---

I have been working on a Shopify app called [File Vault Pro](https://filevaultpro.co) to offer a
better experience selling digital goods on Shopify. For this app, I used the Shopify CLI to create a
Remix BFF, while writing the core application server in Elixir / Phoenix. The Shopify CLI
automatically configures the Shopify application environment and handles a dynamically named https
tunnel (via Cloudflare tunnels) really well, but I also needed an https tunnel to the backend
service (I am using ngrok here), which could not be dynamically updated. This would require running
the backend server with ngrok, updating the environment variable for the API endpoint with the
dynamically generated URL in the Remix project and _then_ running the Remix server. Not the end of
the world, but also not the most enjoyable workflow. Then I found that you can use custom static
domains with ngrok.

## Create Custom Domain

Ngrok now offers
[one free static domain](https://ngrok.com/blog-post/free-static-domains-ngrok-users). First, create
a custom domain in ngrok by following the steps outlined in the blog post referenced above.

## Update Ngrok Configuration File

With the new static domain name in hand, next we'll have to update or create the ngrok configuration
file. By typing `ngrok config check` you should see the file path to the ngrok configuration file.
Now, open that in your editor of choice. Alternatively, running `ngrok config edit` should open or
create and open the configuration file in your system's default editor. The ngrok configuration file
is a `.yml` file. Full documentation for ngrok configuration options can be found in their
[documentation](https://ngrok.com/docs/agent/config/). For example's sake, here is a basic version
that achieves our desired outcome:

```yaml
version: '2'
authtoken: '*********************'
tunnels:
  shopify_backend:
    proto: http
    addr: 4000
    domain: <your-domain>.ngrok-free.app
```

You can obtain your auth token via the ngrok dashboard. Give the tunnel whatever name you would
like. I called mine 'shopify_backend'. With the static domain provisioned and the configuration file
saved, you should now be able to start your service by name like this:

```bash
ngrok start shopify_backend
```

Now, you don't have to worry about starting your services in the right order, or updating the
environment variable that references your ngrok service every time you start the dependent service.
