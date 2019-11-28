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
  deleteTeamMember,
  getProjectTeam,
} from "./controllers/projectControllers";
import { getUser, registerUser, editUser, deleteUser } from "./controllers/userControllers";
import { getTasks, getTask, createTask, deleteTask, getTaskTeam, addTaskMember, deleteTaskMember } from "./controllers/taskControllers";
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
  app.get("/api/project/:project_id/member", getProjectTeam);
  app.post("/api/projectTeam/:projectId/member/:userId", addTeamMember);
  app.post("/api/projectTeam/:projectId/member/:userId", deleteTeamMember);


  app.get("/api/tasks", getTasks);
  app.get("/api/task/:id", getTask);
  app.post("/api/task", createTask);
  app.post("/api/projectTask/:projectId/task/:taskId", deleteTask);
  app.post("/api/taskTeam/:taskId/member", getTaskTeam);
  app.post("/api/taskTeam/:taskId/member/:userId", addTaskMember);
  app.post("/api/taskTeam/:taskId/member/:userId", deleteTaskMember);

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
