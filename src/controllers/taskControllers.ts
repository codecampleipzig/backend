import { Request, Response } from 'express';

import { tasks } from '../mockdata';

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
  res.send('POST request to new task');
};
