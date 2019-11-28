import { Request, Response, NextFunction } from "express";
import { query } from "../db";

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbResponse = await query("SELECT * from projects");
    res.send({ projects: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbResponse = await query("SELECT * from projects WHERE projectId = $1", [req.params.id]);
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

    await query(
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
    const dbResponse = await query(
      `SELECT projects.project_id, project_title, project_description, project_image_url, project_goal, project_creator, project_status FROM projects
      WHERE EXISTS 
        (SELECT * from user_project
        WHERE project_id = projects.project_id AND user_id = $1)`,
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
    const dbResponse = await query(
      `SELECT projects.project_id, project_title, project_description, project_image_url, project_goal, project_creator, project_status FROM projects
      WHERE NOT EXISTS 
        (SELECT * from user_project
        WHERE project_id = projects.project_id AND user_id = $1)`,
      [id],
    );
    res.send({ projects: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};

export const getProjectTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project_id = req.params.projectId;
    const dbResponse = await query(
      `SELECT project.project_id, user.user_id, user.user_name, user.user_mail, user_image_url FROM users
      JOIN project_user on project_user.user_id = user.user_id
      JOIN project on project_user.project_id = $1`,
      [project_id],
    );
    res.send({ projects: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};

export const addTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {project_id, user_id} = req.params;
    const dbResponse = await query (
      `INSERT INTO user_project (project_id, user_id) 
      VALUES ($1, $2) RETURNING *`, 
      [project_id, user_id]
    );
    res.send({ project_id, user_id});
  }catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {project_id, user_id} = req.params;
    const dbResponse = await query (
      `DELETE FROM user_project 
      WHERE user_project.project_id = $1 AND user_project.user_id = $2`,
      [project_id, user_id]
    );
    res.send({ project_id, user_id});
  }catch (error) {
    next(error);
  }
};



