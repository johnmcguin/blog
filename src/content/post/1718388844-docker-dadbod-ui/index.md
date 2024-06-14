---
title: 'Docker Dadbod Ui'
slug: 'docker-dadbod-ui'
description: 'Connect to a Dockerized PostgreSQL Database with vim-dadbod-ui'
publishDate: 2024-06-14
tags: ['recipe']
draft: false
---

In normal mode, invoke `:DBUI`, establish a new connection with `A`. When prompted to enter a
connection string, follow the
[PG spec](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING-URIS).

e.g. `postgresql://<db-user>:<db-password>@localhost:5432/<db-name>`
