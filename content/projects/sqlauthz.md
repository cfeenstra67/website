---
title: 'sqlauthz'
date: '2024-01-15'
description: 'sqlauthz is a tool for declaratively managing permissions for PostgreSQL'
repo: cfeenstra67/sqlauthz
live: https://www.npmjs.com/package/sqlauthz
---
`sqlauthz` is a tool that I made over the holidays at the end of 2023 to solve a problem that I've had at every job I've ever worked at: although PostgreSQL has really great functionality for managing roles and permissions, many teams don't fully utilize them because there aren't great tools to manage them with. I've found the declarative approach used by infrastructure-as-code tools to be really excellent, and I set out to create something similar that could be used to manage permissions. It uses the Polar authorization language developed by Oso to define permissions, and compiles those rules into SQL statements that update your database to the desired state.

`sqlauthz` is designed so that simple authorization rules like granting read-only access across all tables to a user are very simple to write, but it also supports more sophisticated rules such as row and column-level security.
