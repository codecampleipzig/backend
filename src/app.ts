import express from "express";
import { Request, Response, NextFunction } from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";

import {
  createProject,
  getProjects,
  getProject,
  getUserProjects,
  getExploreProjects,
} from "./controllers/projectControllers";
import { getUser, registerUser, editUser, deleteUser } from "./controllers/userControllers";
import { getTasks, getTask, createTask } from "./controllers/taskControllers";
import { setupDatabase } from "./migrations";

export const getApp = async () => {
  const app = express();
  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(cors());

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

  await setupDatabase();
  return app;
};
