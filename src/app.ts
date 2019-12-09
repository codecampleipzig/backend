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
  addTeamMember,
  deleteTeamMember,
} from "./controllers/projectControllers";
import { getUser, registerUser, loginUser, editUser, deleteUser } from "./controllers/userControllers";
import { createTask, addTaskMember, deleteTaskMember, updateTask } from "./controllers/taskControllers";
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

  // To be added on to protectedRoute and requires :userId to be part of req.params
  const privateToUser = (req: Request, res: Response, next: NextFunction) => {
    const routeUserId = req.params.userId;
    const authUserId = req['user'] && req['user'].userId;
    if (authUserId && routeUserId == authUserId) {
      return next();
    }
    else {
      res.send(403);
    }
  }

  app.get("/api/test", (_, res) => {
    res.json({ ok: true });
  });

  app.get("/api/projects", getProjects); // for searchbar
  app.get("/api/project/:projectId", getProject);
  app.post("/api/project", protectedRoute, createProject); // test with insomnia works
  app.get("/api/myprojects/:userId", getUserProjects); // test with insomnia works
  app.get("/api/exploreprojects/:userId", getExploreProjects); // test with insomnia works
  app
    .route("/api/projectTeam/:projectId/member/:userId")
    .put(protectedRoute, privateToUser, addTeamMember, getProject)
    .delete(protectedRoute, privateToUser, deleteTeamMember, getProject);

  app.post("/api/project/:projectId/task", protectedRoute, createTask); // test with insomnia works
  app.route("/api/task/:taskId").patch(protectedRoute, updateTask, getProject);
  app
    .route("/api/taskTeam/:taskId/member/:userId")
    .put(protectedRoute, privateToUser, addTaskMember, getProject)
    .delete(protectedRoute, privateToUser, deleteTaskMember, getProject);

  /**
 * Register user
 */
  app.post("/api/register", registerUser);

  /**
   * Login user
   */
  app.post("/api/login", loginUser);
  app.get("/api/user/:userId", protectedRoute, privateToUser, getUser);
  app.put("/api/user/:userId", protectedRoute, privateToUser, editUser);
  app.delete("/api/user/:userId", protectedRoute, privateToUser, deleteUser);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500);
    res.send({ error: err });
  });

  await setupDatabase();
  return app;
};
