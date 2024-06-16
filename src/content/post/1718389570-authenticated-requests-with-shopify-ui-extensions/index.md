---
title: 'Authenticated Requests From Shopify UI Extensions'
slug: 'authenticated-requests-from-shopify-ui-extensions'
description: 'How to make authenticated requests to your API within a Shopify UI extension.'
publishDate: 2024-06-16
tags: ['how-to', 'shopify']
draft: false
---

Shopify has a notion of
[Checkout UI extensions](https://shopify.dev/docs/api/checkout-ui-extensions). These provide hooks,
or targets, to write custom user experiences during the checkout flow. For my Shopify app,
[File Vault Pro](https://filevaultpro.co/), users are able to associate files with specific products
and variants. I needed to leverage UI extensions to provide download access during the checkout
experience. There would be two targets for my use case, the "Thank You" and "Order Status" pages.
This guide will focus on how to make an authorized request from an extension directly to your API.
Creating and configuring an extension is beyond the scope of this guide, but there is plenty of
documentation to do so. This guide also assumes an app created with the shopify remix template.

## Configuration

The extensions run in a sandboxed environment and need to be given a couple of permissions. First,
from within your partners dashboard, select the app you are developing. From there, select the "API
Access" tab. Scroll down and make sure to enable the "Allow network access in checkout and account
UI extensions" section. Within your `shopify.extension.toml` file, make sure to uncomment the line
marked `network_access = true`. This gives your extension the "capability" to make network requests.

## Obtain Token

From within the code of your extension, grab the session token with the hook `useSessionToken`. Make
sure that the import path is correct. For example, for the "Order Status" page, the import path is
"@shopify/ui-extensions-react/customer-account". Consult the documentation to ensure you are using
the correct import path given your target. Now that you have verified that you can get the session
token on the client side, it's time to move towards the server.

## Server

In my stack, the Remix app serves as a Backend for Frontend (BFF) with the main application code
running in a separate service. Instead of proxying the request through the Remix app, I opted to go
directly to the backend API. This involves a couple of steps:

1. From the partner dashboard, select the app and grab the client secret. Add this as an environment
   variable to your server. This will be used to verify the incoming JWT passed from the extension.
2. This will vary depending on your server, but the gist is that you will want to verify the JWT for
   any of the routes that you've created for the extension to consume. This will likely take the
   form of some sort of middleware. Follow
   [the instructions](https://shopify.dev/docs/apps/build/authentication-authorization/session-tokens/set-up-session-tokens#verify-the-session-tokens-signature)
   to validate the JWT. It is highly recommended to find a JWT validation library to help with this
   process. I am using Elixir's [Joken](https://hexdocs.pm/joken/readme.html) library which greatly
   simplifies this. Consult [JWT.io](https://jwt.io/libraries) to identify a language specific
   library for you.
3. CORS - you'll also need to enable CORS for the given routes that you are exposing to the
   extension. These will have a dynamic origin, so origin cannot be depended upon fully as is for
   CORS configuration.

## Integration

Test. At this point, if everything is configured correctly, you should be able to make an
authenticated request to your API from the extension. Within the extension code, make a `fetch`
request passing in the session token as an authorization header.

```typescript
let res = await fetch(`URL`, {
	headers: {
		Authorization: `Bearer ${token}`,
	},
	mode: 'cors',
});
```

## Alternatives

I haven't explored these options, but I think that you should be able to call the Remix backend in a
similar manner. I would guess but have not verified that an app created with the CLI is likely
configured to automatically verify the JWT. I believe that an
[App Proxy](https://shopify.dev/docs/api/shopify-app-remix/v2/authenticate/public/app-proxy) could
also be a viable option here, but have not explored these in depth.
