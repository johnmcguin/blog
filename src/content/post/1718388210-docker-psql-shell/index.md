---
title: 'Shell into Containerized PostgreSQL Database'
slug: 'docker-psql-shell'
description: 'How to shell into a postgres database running in a docker container.'
publishDate: 2024-06-14
tags: ['recipe']
draft: false
---

Shell into the running container:

```bash
docker exec -it <container-id> /bin/bash
```

Run psql to connect to the database:

```bash
psql -d <db-name> -U <user>
```
