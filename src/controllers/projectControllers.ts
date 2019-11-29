import { Request, Response, NextFunction } from "express";
import { query } from "../db";
import { QueryResult } from "pg";
import { Project } from "src/datatypes/Project";
import { labeledStatement } from "@babel/types";

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchTermQueryParam = req.query.searchTerm;
    if (Array.isArray(searchTermQueryParam)) {
      return res.status(400).send({ message: "Only one search term parameter allowed" });
    }
    let limitParam = req.query.limit;
    let offsetParam = req.query.offset;

    if (!limitParam) {
      limitParam = "20";
    }
    if (!offsetParam) {
      offsetParam = "0";
    }
    const limitParamNum = parseInt(limitParam);
    const offsetParamNum = parseInt(offsetParam);

    if (Number.isNaN(limitParamNum) || limitParamNum < 0) {
      return res.status(400).send({ message: "Limit has to be a non-negative number" });
    }
    if (Number.isNaN(offsetParamNum) || offsetParamNum < 0) {
      return res.status(400).send({ message: "Offset has to be a non-negative number" });
    }

    var dbResponse: QueryResult<Project> = await searchForProjects(searchTermQueryParam, limitParamNum, offsetParamNum);
    res.send({ projects: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};

async function searchForProjects(searchTermQueryParam: string, limit: number, offset: number) {
  var dbResponse: QueryResult<Project>;
  if (!searchTermQueryParam) {
    dbResponse = await query("SELECT * from projects");
  } else {
    const searchTermQueryParamToArray = searchTermQueryParam.split(" ");

    let queryString = "SELECT * from projects";
    for (let i = 0; i < searchTermQueryParamToArray.length; i++) {
      let queryCondition;
      if (i == 0) {
        queryCondition = ` WHERE LOWER(project_title) LIKE $${i + 1}`;
      } else {
        queryCondition = ` AND LOWER(project_title) LIKE $${i + 1}`;
      }
      queryString = queryString + queryCondition;
      searchTermQueryParamToArray[i] = calculateSqlParamValue(searchTermQueryParamToArray[i]);
    }

    dbResponse = await query(queryString + specifyPagination(limit, offset), searchTermQueryParamToArray);
  }
  return dbResponse;

  function calculateSqlParamValue(param: string) {
    return `%${param}%`.toLowerCase();
  }

  function specifyPagination(limit: number, offset: number) {
    return `LIMIT ${limit} OFFSET ${offset}`;
  }
}

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get Project
    const project = await query("SELECT * from projects WHERE project_id = $1", [req.params.id]);

    // Get Project Creator and replace it in project
    const projectCreatorId = project.rows[0].projectCreator;
    const projectCreator = await query("SELECT u.user_id, u.user_name, u.user_email, u.user_image_url from users u WHERE user_id = $1", [projectCreatorId]);
    project.rows[0].projectCreator = projectCreator.rows[0];

    // Get project Team and append to project
    const projectTeam = await query(
      `SELECT u.user_id, u.user_name, u.user_email, u.user_image_url from user_project up 
      JOIN users u ON up.user_id = u.user_id
      WHERE up.project_id = $1`,
      [req.params.id]
    );
    project.rows[0].projectTeam = projectTeam.rows;

    // Get Tasks and tasksTeams and append to project
    const tasks = await query(`SELECT * from tasks WHERE project_id = $1`, [req.params.id])
    // Create empty array in every task
    for (let i = 0; i < tasks.rows.length; i++) {
      tasks.rows[i].taskTeam = [];
    }
    const tasksTeams = await query(
      `SELECT t.task_id, u.user_id, u.user_name, u.user_email, u.user_image_url from tasks t
      JOIN user_task ut ON t.task_id = ut.task_id
      JOIN users u ON u.user_id = ut.user_id
      WHERE project_id = $1`,
      [req.params.id]
    )
    // Loop through tasks and put every user by task into projectTasks
    tasksTeams.rows.forEach(element => {
      const {taskId} = element;
      delete element.taskId;
      tasks.rows.find(t => t.taskId == taskId).taskTeam.push(element);
    });
    project.rows[0].projectTasks = tasks.rows;

    if (project.rows.length == 1) {
      res.send({ project: project.rows[0] });
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
      `INSERT INTO projects(project_title, project_description, project_image_url, project_goal, project_creator) 
      VALUES($1, $2, $3, $4, $5) RETURNING *`,
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
      JOIN project on project_user.project_id = $1 RETURNING *`,
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
      WHERE user_project.project_id = $1 AND user_project.user_id = $2 RETURNING user_id`,
      [project_id, user_id]
    );
    res.send({ project_id, user_id});
  }catch (error) {
    next(error);
  }
};

export const getProjectTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project_id = req.params.projectId;
    const dbResponse = await query(
      `SELECT project.project_id, task_title, task_description, task_status, task_creator, task_init_date, menu_section FROM tasks
      JOIN project on project.project_id = $1`,
      [project_id],
    );
    res.send({ tasks: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};
