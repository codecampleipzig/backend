# Communic Backend

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
