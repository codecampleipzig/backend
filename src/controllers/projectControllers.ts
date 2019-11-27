import { Request, Response, NextFunction } from "express";
import { query } from "../db";
import { QueryResult } from "pg";
import { Project } from "src/datatypes/Project";

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchTermQueryParam = req.query.searchTerm;
    if (Array.isArray(searchTermQueryParam)) {
      res.status(400).send({ message: "Only one search term parameter allowed" });
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

    if (Number.isNaN(limitParamNum) || limitParamNum < 0){
      res.status(400).send({message: "Limit has to be a non-negative number"})
    }
    if (Number.isNaN(offsetParamNum) || offsetParamNum < 0){
      res.status(400).send({message: "Offset has to be a non-negative number"})
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

  }
  else {
    const searchTermQueryParamToArray = searchTermQueryParam.split(" ");

    let queryString = "SELECT * from projects";
    for (let i = 0; i < searchTermQueryParamToArray.length; i++) {
      let queryCondition;
      if (i == 0) {
        queryCondition = ` WHERE LOWER(project_title) LIKE $${i + 1}`
      } else {
        queryCondition = ` AND LOWER(project_title) LIKE $${i + 1}`
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





