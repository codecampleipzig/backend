import { Request, Response, NextFunction } from "express";
import { query } from "../db";

import { tasks } from "../mockdata";

export const getTasks = (req: Request, res: Response) => {
  res.send({ tasks });
};

export const getTask = (req: Request, res: Response) => {
  const id = req.params.id;
  const taskId = tasks.filter(task => task.taskId == parseInt(id));
  res.send({ taskId });
};

export const createTask = (req: Request, res: Response) => {
  res.status(201);
  res.send("POST request to new task");
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
    res.send({ projects: dbResponse.rows });
  } catch (error) {
    next(error);
  }
};

export const addTaskMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {task_id, user_id} = req.params;
    const dbResponse = await query (
      `INSERT INTO user_task (task_id, user_id) 
      VALUES ($1, $2) RETURNING *`,
      [task_id, user_id]
    );
    res.send({ task_id, user_id});
  }catch (error) {
    next(error);
  }
};

export const deleteTaskMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {task_id, user_id} = req.params;
    const dbResponse = await query (
      `DELETE FROM user_task 
      WHERE user_task.task_id = $1 AND user_task.user_id = $2`,
      [task_id, user_id]
    );
    res.send({ task_id, user_id});
  }catch (error) {
    next(error);
  }
};

