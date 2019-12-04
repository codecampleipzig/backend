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
  addTeamMember,
  deleteTeamMember
} from "./controllers/projectControllers";
import { getUser, registerUser, editUser, deleteUser } from "./controllers/userControllers";
import {
  createTask,
  addTaskMember,
  deleteTaskMember,
  updateTask,
} from "./controllers/taskControllers";
import { setupDatabase } from "./migrations";

export const getApp = async () => {
  const app = express();
  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(cors());

  app.get("/api/test", (_, res) => {
    res.json({ ok: true });
  });

  app.get("/api/projects", getProjects); // for searchbar
  app.get("/api/project/:projectId", getProject);
  app.post("/api/project", createProject); // test with insomnia works
  app.get("/api/myprojects/:userId", getUserProjects); // test with insomnia works
  app.get("/api/exploreprojects/:userId", getExploreProjects); // test with insomnia works
  app
    .route("/api/projectTeam/:projectId/member/:userId")
    .put(addTeamMember, getProject)
    .delete(deleteTeamMember, getProject);

  app.post("/api/project/:projectId/task", createTask); // test with insomnia works
  app.route("/api/task/:taskId").patch(updateTask, getProject);
  app
    .route("/api/taskTeam/:taskId/member/:userId")
    .put(addTaskMember, getProject)
    .delete(deleteTaskMember, getProject);

  app.get("/api/user/:id", getUser);
  app.post("/api/register", registerUser);
  app.put("/api/user/:id", editUser);
  app.delete("/api/user/:id", deleteUser);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500);
    res.send({ error: err });
  });

  await setupDatabase();
  return app;
};
