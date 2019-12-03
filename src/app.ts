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
import { getUser, registerUser, loginUser, editUser, deleteUser } from "./controllers/userControllers";
import { getTasks, getTask, createTask } from "./controllers/taskControllers";
import { setupDatabase } from "./migrations";

export const getApp = async () => {
  const app = express();
  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(cors());

  // Set protected for private routes available only to authenticated users
    // Check if req has Authorization header
      // If no, send status unauthorized 401
      // If yes, extract user data from Authorization
        // jwt.verify method to check extracted token from req authentication header 
        // against private token generated from jwt 
        // ser user in req.user

// const protected;


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

  /**
   * Get user
   */
  app.get("/api/user/:id", getUser);
  
  /**
   * Register user
   */
  app.post("/api/register", registerUser);

  /**
   * Login user
   */
  app.post("/api/login", loginUser);

  app.put("/api/user/:id", editUser);
  app.delete("/api/task/:id", deleteUser);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500);
    res.send({ error: err });
  });

  await setupDatabase();
  return app;
};
