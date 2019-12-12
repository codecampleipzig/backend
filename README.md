# Communic Backend

master: [![Build Status](https://travis-ci.org/codecampleipzig/communic-backend.svg?branch=master)](https://travis-ci.org/codecampleipzig/communic-backend)
  develop: [![Build Status](https://travis-ci.org/codecampleipzig/communic-backend.svg?branch=develop)](https://travis-ci.org/codecampleipzig/communic-backend)

## Database Setup

The communic backend requires a Postgres Database to run tests.
The tables and some test data will be setup automatically.
Set the following environment variables to provide the connection details for your database.

```
$ PGUSER=dbuser \
  PGHOST=database.server.com \
  PGPASSWORD=secretpassword \
  PGDATABASE=mydb \
  PGPORT=3211 \
  npm run dev
```

## Documentation

### Commands

- npm run compodoc
