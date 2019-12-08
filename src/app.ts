import express from "express";
import { Request, Response, NextFunction } from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import * as jwt from "jsonwebtoken";
import { secret } from "./configuration/index";

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
  const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
    // Check if req has Authorization header

    const authHeader = req.headers["authorization"];
    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwibmFtZSI6Ik5pY2siLCJlbWFpbCI6Im5pY2tAbmljay5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRPemhPRUthU3hGYkRWeXVNQm05dVlPRWw3RlZsdnRMMFphd1NZZlpwL29acHZtZjVaV3pIVyIsImlhdCI6MTU3NDk1NDQ2OX0.ZoKpP1KfpMocTL0BZFXo86TDvQKseaGW4u7_vWqMb_8

    // If yes, extract user data from Authorization
    const accessToken = authHeader && authHeader.split(" ")[1];
    // If no token value, send status unauthorized 401
    if (!accessToken) {
      return res.sendStatus(401);
    }

    jwt.verify(accessToken, secret, (err, user) => {
      // If error in token verification, send status forbidden 403
      if (err) return res.sendStatus(403);

      req["user"] = user;
      next();
    })
  }

  app.get("/api/test", (_, res) => {
    res.json({ ok: true });
  });

  app.get("/api/projects", protectedRoute, getProjects);
  app.get("/api/project/:id", protectedRoute, getProject);
  app.post("/api/project", protectedRoute, createProject);
  app.get("/api/myprojects/:userId", protectedRoute, getUserProjects);
  app.get("/api/exploreprojects/:userId", protectedRoute, getExploreProjects);

  app.get("/api/tasks", protectedRoute, getTasks);
  app.get("/api/task/:id", protectedRoute, getTask);
  app.post("/api/task", protectedRoute, createTask);

  app.get("/api/user/:id", protectedRoute, getUser);
  app.put("/api/user/:id", protectedRoute, editUser);
  app.delete("/api/task/:id", protectedRoute, deleteUser);

  /**
 * Register user
 */
  app.post("/api/register", registerUser);

  /**
   * Login user
   */
  app.post("/api/login", loginUser);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500);
    res.send({ error: err });
  });

  await setupDatabase();
  return app;
};
