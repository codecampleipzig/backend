import { Request, Response, NextFunction } from "express";

import pg from "pg";
import pgCamelCase from "pg-camelcase";
import { projects } from "../mockdata";

pgCamelCase.inject(pg);
const pgPool = new pg.Pool();

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbResponse = await pgPool.query("SELECT * from projects");
    res.send({ projects: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbResponse = await pgPool.query("SELECT * from projects WHERE projectId = $1", [req.params.id]);
    if (dbResponse.rows.length == 1) {
      res.send({ project: dbResponse.rows[0] });
    } else {
      res.status(404).send({ error: "Project not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const title = body.projectTitle;
    const description = body.projectDescription;
    const imageURL = body.projectImageURL;
    const goal = body.projectGoal;
    const creator = parseInt(body.projectCreator);

    if (!title || !description || !imageURL || !goal || Number.isNaN(creator)) {
      throw new Error("Not a valid project");
    }

    await pgPool.query(
      "INSERT INTO projects(project_title, project_description, project_image_url, project_goal, project_creator) VALUES($1, $2, $3, $4, $5)",
      [title, description, imageURL, goal, creator],
    );
    res.status(201).send({ status: "ok" });
  } catch (error) {
    next(error);
  }
};

export const getUserProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId;
    const dbResponse = await pgPool.query(
      `SELECT projects.project_id, project_title, project_description, project_image_url, project_goal, project_creator, project_status FROM projects
      LEFT JOIN user_project ON user_project.project_id = projects.project_id
      WHERE user_project.user_id = $1 OR projects.project_creator = $1`,
      [id],
    );
    res.send({ projects: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};

export const getExploreProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId;
    const dbResponse = await pgPool.query(
      `SELECT projects.project_id, project_title, project_description, project_image_url, project_goal, project_creator, project_status FROM projects
      LEFT JOIN user_project ON user_project.project_id = projects.project_id
      WHERE (user_project.user_id != $1 AND projects.project_creator != $1) OR user_project.user_id IS NULL`,
      [id],
    );
    res.send({ projects: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};
