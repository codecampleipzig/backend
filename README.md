# Communic Backend

## Database Setup

The communic backend requires a Postgres Database.
Set the following environment variables to provide the connection details for your databse.

```
$ PGUSER=dbuser \
  PGHOST=database.server.com \
  PGPASSWORD=secretpassword \
  PGDATABASE=mydb \
  PGPORT=3211 \
  npm run dev
```
