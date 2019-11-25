import pg from "pg";
import pgCamelCase from "pg-camelcase";

pgCamelCase.inject(pg);
export const db = new pg.Pool();

export const query = (sql: string, params?: any[]) => {
  return db.query(sql, params);
};
