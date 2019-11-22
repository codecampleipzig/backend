import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';

import {
  createProject,
  getProjects,
  getProject,
  getUserProjects,
  getExploreProjects,
} from './controllers/projectControllers';
import { getUser, registerUser, editUser, deleteUser } from './controllers/userControllers';
import { getTasks, getTask, createTask } from './controllers/taskControllers';

const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
};

export const getApp = () => {
  const app = express();
  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(cors(corsOptions));

  app.get('/api/v1/test', (_, res) => {
    res.json({ ok: true });
  });

  app.get('/api/projects', getProjects);
  app.get('/api/project/:id', getProject);
  app.post('/api/project', createProject);
  app.get('/api/myprojects/:userId', getUserProjects);
  app.get('/api/exploreprojects/:userId', getExploreProjects);

  app.get('/api/tasks', getTasks);
  app.get('/api/task/:id', getTask);
  app.post('/api/task', createTask);

  app.get('/api/user/:id', getUser);
  app.post('/api/register', registerUser);
  app.put('/api/user/:id', editUser);
  app.delete('/api/task/:id', deleteUser);

  return app;
};
