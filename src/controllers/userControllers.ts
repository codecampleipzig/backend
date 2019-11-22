import { Request, Response } from 'express';

import { users } from '../mockdata';

export const getUser = (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = users.find(user => user.userId == parseInt(id));
  res.send({ userId });
};

export const registerUser = (req: Request, res: Response) => {
  res.status(201);
  res.send('POST request to the register page');
};

export const editUser = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send('PUT request to the userID ' + id);
};

export const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send('PUT request to taskId' + id);
};
