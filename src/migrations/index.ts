import { environment } from "../configuration";
import fs from "fs";
import { Client } from "pg";

export async function setupDatabase() {
  // Init Tables
  const databaseInitSQL = fs.readFileSync(__dirname + "/database-init.sql", { encoding: "utf8" });
  const client = new Client();
  await client.connect();
  await client.query(databaseInitSQL);

  // Insert Test Data if in test environment
  if (environment == "development" || environment == "test") {
    if ((await client.query("SELECT * from users")).rows.length == 0) {
      const testDataSQL = fs.readFileSync(__dirname + "/test-data.sql", { encoding: "utf8" });
      await client.query(testDataSQL);
    }
  }

  await client.end();
}
