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
    const projectId = req.params.projectId;
    const title = body.taskTitle;
    const description = body.taskDescription;
    const goal = body.taskGoal;
    const status = body.taskStatus;
    const creator = parseInt(body.taskCreator);
    const menuSection = body.menuSection;

    if (!title || !description || !goal || !status || Number.isNaN(creator) || !menuSection) {
      throw new Error("Not a valid task");
    }

    await query(
      `INSERT INTO tasks(project_id, task_title, task_description, task_goal, task_status, task_creator, menu_section) 
      VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [projectId, title, description, goal, status, creator, menuSection],
    );
    res.status(201).send({ status: "ok" });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId, taskId } = req.params;
    const dbResponse = await query(
      `DELETE FROM task 
      WHERE task.task_id = $1 AND task.project_id = $2`,
      [taskId, projectId],
    );
    res.send({ taskId, projectId });
  } catch (error) {
    next(error);
  }
};

export const getTaskTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId;
    const dbResponse = await query(
      `SELECT task.task_id, user.user_id, user.user_name, user.user_mail, user_image_url FROM users
      JOIN task_user on task_user.user_id = user.user_id
      JOIN task on task_user.task_id = $1`,
      [taskId],
    );
    res.send({ tasks: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};

export const addTaskMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId, userId } = req.params;
    const dbResponse = await query(
      `INSERT INTO user_task (task_id, user_id) 
      VALUES ($1, $2) RETURNING *`,
      [taskId, userId],
    );
    res.send({ taskId, userId });
  } catch (error) {
    next(error);
  }
};

export const deleteTaskMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId, userId } = req.params;
    const dbResponse = await query(
      `DELETE FROM user_task 
      WHERE user_task.task_id = $1 AND user_task.user_id = $2 RETURNING user_id`,
      [taskId, userId],
    );
    res.send({ taskId, userId });
  } catch (error) {
    next(error);
  }
};
