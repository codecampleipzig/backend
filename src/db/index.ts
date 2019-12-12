import pg, { Pool } from "pg";
import pgCamelCase from "pg-camelcase";

pgCamelCase.inject(pg);
export let db: Pool;

export const query = (sql: string, params?: any[]) => {
  return db.query(sql, params);
};

export const initDbPool = () => {
  db = new pg.Pool({
    max: 3,
  });
};

initDbPool();
