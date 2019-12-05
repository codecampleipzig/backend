import { Request, Response, NextFunction } from "express";
import { query } from "../db";

/**
 * Get ProjectId by TaskId by querying from tasks
 * @param taskId
 */
const getProjectId = async taskId => {
  try {
    const dbResponse = await query(
      `SELECT project_id FROM tasks
      WHERE task_id = $1`,
      [taskId],
    );
    return dbResponse.rows[0].projectId;
  } catch (error) {
    return null;
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const projectId = req.params.projectId;
    const title = body.taskTitle;
    const description = body.taskDescription;
    const status = body.taskStatus;
    const creator = parseInt(body.taskCreator);
    const menuSection = body.menuSection;

    if (!title || !description || !status || Number.isNaN(creator) || !menuSection) {
      throw new Error("Not a valid task");
    }

    await query(
      `INSERT INTO tasks(project_id, task_title, task_description, task_status, task_creator, menu_section) 
      VALUES($1, $2, $3, $4, $5, $6)`,
      [projectId, title, description, status, creator, menuSection],
    );
    res.status(201).send({ status: "ok" });
  } catch (error) {
    next(error);
  }
};


/**
 * updateTask's status with taskStatus is set in the body.
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params;
    const taskStatus = req.body.taskStatus;

    // Add projectId to params for next() getProject()
    req.params.projectId = await getProjectId(taskId);

    if (taskStatus) {
      const dbResponse = await query(
        `UPDATE tasks
        SET task_status = $2
        WHERE task_id = $1`,
        [taskId, taskStatus],
      );
      next();
    } else {
      res.send({ response: "please set taskStatus" });
    }
  } catch (error) {
    next(error);
  }
};

export const addTaskMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId, userId } = req.params;

    // Add projectId to params for next() getProject()
    req.params.projectId = await getProjectId(taskId);

    const dbResponse = await query(
      `INSERT INTO user_task (task_id, user_id) 
      VALUES ($1, $2)`,
      [taskId, userId],
    );
    next();
  } catch (error) {
    next(error);
  }
};

export const deleteTaskMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId, userId } = req.params;

    // Add projectId to params for next() getProject()
    req.params.projectId = await getProjectId(taskId);

    const dbResponse = await query(
      `DELETE FROM user_task ut
      WHERE ut.task_id = $1 AND ut.user_id = $2`,
      [taskId, userId],
    );
    next();
  } catch (error) {
    next(error);
  }
};
