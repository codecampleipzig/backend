import express from "express";
import { Request, Response, NextFunction } from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import fs from "fs";
import process from "process";

import {
  createProject,
  getProjects,
  getProject,
  getUserProjects,
  getExploreProjects,
} from "./controllers/projectControllers";
import { getUser, registerUser, editUser, deleteUser } from "./controllers/userControllers";
import { getTasks, getTask, createTask } from "./controllers/taskControllers";
import { Client } from "pg";

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};

async function setupDatabase() {
  // Init Tables
  const databaseInitSQL = fs.readFileSync(__dirname + "/sql/database-init.sql", { encoding: "utf8" });
  const client = new Client();
  await client.connect();
  await client.query(databaseInitSQL);

  // Insert Test Data if in test environment
  if (process.env.NODE_ENV != "production") {
    if ((await client.query("SELECT * from users")).rows.length == 0) {
      const testDataSQL = fs.readFileSync(__dirname + "/sql/test-data.sql", { encoding: "utf8" });
      await client.query(testDataSQL);
    }
  }

  await client.end();
}

export const getApp = () => {
  setupDatabase();

  const app = express();
  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(cors(corsOptions));

  app.get("/api/test", (_, res) => {
    res.json({ ok: true });
  });

  app.get("/api/projects", getProjects);
  app.get("/api/project/:id", getProject);
  app.post("/api/project", createProject);
  app.get("/api/myprojects/:userId", getUserProjects);
  app.get("/api/exploreprojects/:userId", getExploreProjects);

  app.get("/api/tasks", getTasks);
  app.get("/api/task/:id", getTask);
  app.post("/api/task", createTask);

  app.get("/api/user/:id", getUser);
  app.post("/api/register", registerUser);
  app.put("/api/user/:id", editUser);
  app.delete("/api/task/:id", deleteUser);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500);
    res.send({ error: err });
  });

  return app;
};
