import { Request, Response, NextFunction } from "express";
import { query } from "../db";

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbResponse = await query(`SELECT * from tasks`);
    res.send({ tasks: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbResponse = await query(`SELECT * from tasks WHERE task_id = $1`, [req.params.id]);
    if (dbResponse.rows.length == 1) {
      res.send({ project: dbResponse.rows[0] });
    } else {
      res.status(404).send({ error: "Task not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const title = body.projectTitle;
    const imageURL = body.projectImageURL;
    const description = body.projectDescription;
    const goal = body.projectGoal;
    const status = body.taskStatus;
    const creator = parseInt(body.projectCreator);

    if (!title || !imageURL || !description || !goal || !status || Number.isNaN(creator)) {
      throw new Error("Not a valid task");
    }

    await query(
      `INSERT INTO tasks(task_title, task_description, task_image_url, task_goal, task_creator) 
      VALUES($1, $2, $3, $4, $5, $6)`,
      [title, imageURL, description, goal, status, creator],
    );
    res.status(201).send({ status: "ok" });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {project_id, task_id} = req.params;
    const dbResponse = await query (
      `DELETE FROM task 
      WHERE task.task_id = $1 AND task.project_id = $2`,
      [task_id, project_id]
    );
    res.send({task_id, project_id});
  }catch (error) {
    next(error);
  }
};

export const getTaskTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task_id = req.params.taskId;
    const dbResponse = await query(
      `SELECT task.task_id, user.user_id, user.user_name, user.user_mail, user_image_url FROM users
      JOIN task_user on task_user.user_id = user.user_id
      JOIN task on task_user.task_id = $1`,
      [task_id],
    );
    res.send({ tasks: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};

/**
 * updateTask's status with taskStatus is set in the body.
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {taskId} = req.params;
    const taskStatus = req.body.taskStatus;

    // Add projectId to params for next() getProject()
    req.params.projectId = await getProjectId(taskId);

    if ( taskStatus ) {
      const dbResponse = await query (
        `UPDATE tasks
        SET task_status = $2
        WHERE task_id = $1`,
        [taskId, taskStatus]
      );
      next();
    }
    else {
      res.send({ "response" : "please set taskStatus"});
    }

  }catch (error) {
    next(error);
  }
};

export const addTaskMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {taskId, userId} = req.params;

    // Add projectId to params for next() getProject()
    req.params.projectId = await getProjectId(taskId);

    const dbResponse = await query (
      `INSERT INTO user_task (task_id, user_id) 
      VALUES ($1, $2)`,
      [taskId, userId]
    );
    next();
  }catch (error) {
    next(error);
  }
};

export const deleteTaskMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {taskId, userId} = req.params;
    
    // Add projectId to params for next() getProject()
    req.params.projectId = await getProjectId(taskId);

    const dbResponse = await query (
      `DELETE FROM user_task ut
      WHERE ut.task_id = $1 AND ut.user_id = $2`,
      [taskId, userId]
    );
    next();
  }catch (error) {
    next(error);
  }
};

/**
 * Get ProjectId by TaskId by querying from tasks
 * @param taskId 
 */
const getProjectId = async (taskId) => {
  try {
    const dbResponse = await query (
      `SELECT project_id FROM tasks
      WHERE task_id = $1`,
      [taskId]
    );
    return dbResponse.rows[0].projectId;
  }catch (error) {
    return false
  }
}
