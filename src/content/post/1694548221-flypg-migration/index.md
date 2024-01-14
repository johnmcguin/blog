---
title: 'Migrating PostgreSQL From Fly.io to Digital Ocean'
slug: 'migrate-pg-database'
description:
  'Learn how to migrate a Fly.io PostgreSQL database to a Digital Ocean PostgreSQL Managed Database.'
publishDate: 2023-09-12
tags: ['how-to']
draft: false
---

Without giving too much backstory, I had a web application connected to [fly.io's](https://fly.io/)
postgres offering. Fly.io admits that
[this is not a managed database](https://fly.io/docs/postgres/getting-started/what-you-should-know/)
and I decided I wanted a managed database on a major cloud provider's infrastructure, with all of
the niceties that come along with that.

## Assumptions

I am assuming that you have a local installation of PostgreSQL and its cli utilities. Installation
is out of scope for this post, but specifically, you should have `pg_dump` and `pg_restore` in your
path, which you can verify with

```bash
which pg_dump && which pg_restore
```

I am also assuming that you have created a Digital Ocean (or other) database already.

## Part 1: Exporting Data From Fly Postgres

First things first, we need to export our data from our current database in Fly.io. To do this, we
need to proxy a connection to our database server using the
[flyctl proxy](https://fly.io/docs/flyctl/proxy/) command. First, verify or identify the name of
your database application in Fly by running

```bash
flyctl apps list
```

This should help you identify the name of the postgres app. Once we have this, we need to proxy a
connection to the app by running

```bash
flyctl proxy 15432:5432 -a <pg-app-name>
```

I am proxying the connection to local port `15432` instead of the postgres default of `5432` because
I already have a pg service running locally via docker. With this connection established, in a new
terminal tab, we can run

```bash
pg_dump -h localhost -p 15432 -U <user> -Fc <db> > <backup.pgsql>
```

You can consult some relevant documentation in
[Digital Ocean](https://docs.digitalocean.com/products/databases/postgresql/how-to/import-databases/)
for a detailed breakdown of the flags but the gist is that we are connecting to localhost:15432 and
dumping the output into a file we named `backup.pgsql`. You can obtain the user and password via the
connection string that your fly app is using. This should have been set when you configured the
app's connection to postgres via `flyctl pg attach`. If you don't readily have this information, you
can obtain it by SSHing into the application and running a `printenv` to discover the
`DATABASE_URL`. Once the `pg_dump` was successful, we can move onto the import.

## Part 2: Importing Data To Digital Ocean

With the `pg_dump` complete and our snapshot ready to restore, run

```bash
pg_restore -d <do_connection_string> <path/to/backup>
```

Your digital ocean connection string is readily accessible in the Digital Ocean dashboard. Take care
to wrap the connection string in quotes. With any luck, you should now have restored your data to
your new DO database. From here, we can update our application.

## Part 3: Updating Application Servers

Take precautions with your approach if your application is in production, but we can now run

```bash
flyctl secrets set DATABASE_URL="<do-db-connection-string>"
```

which will update your application server to now point to your DO database. You can now spin down
the fly postgres machines. This path would apply to other managed database providers as well as a
restore workflow within a single database, but I just wanted to highlight some of the nuances I
encountered specifically migrating off of Fly.io. Hope it helps!
