import express from 'express';
import bodyParser from 'body-parser';
import { projects } from './mockdata';
import { tasks } from './mockdata';
import { users } from './mockdata';

const cors = require('cors');

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}





export const getApp = () => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors(corsOptions));

  app.get('/api/v1/test', (_, res) => {
    res.json({ ok: true });
  });

  app.get('/api/projects',(req,res,next) => {
    res.send({ projects });
  });

  app.get('/api/project/:id',(req,res,next) => {
    const id = req.params.id;
    const projectId = projects.find(project => project.projectId == parseInt(id))
    res.send({ projectId })
  });

  app.get('/api/tasks',(req,res,next) => {
    res.send({ tasks })
  });

  app.get('/api/task/:id',(req,res,next) => {
    const id = req.params.id;
    const taskId = tasks.filter(task => task.taskId == parseInt(id));
    res.send({ taskId })
  })

  app.get('/api/user/:id',(req,res,next) => {
    const id = req.params.id;
    const userId = users.find(user => user.userId == parseInt(id))
    res.send({ userId })
  });

  app.get('/api/myprojects/:userId',(req,res,next) => {
    const userId = req.params.userId;
    const myProjects = projects.filter(project => project.projectTeam.some(user => user.userId == parseInt(userId)));
    res.send({ myProjects })
  });

  app.get('/api/exploreprojects/:userId',(req,res,next) => {
    const userId = req.params.userId;
    const exploreProjects = projects.filter(project => !project.projectTeam.some(user => user.userId == parseInt(userId)));
    res.send({ exploreProjects })
  });

  app.post('/api/project',(req,res,next) => {
    res.status(201);
    res.send("POST request to new project page");
  });

  app.post('/api/register',(req,res,next) => {
    res.status(201);
    res.send("POST request to the register page")
  });

  app.post('/api/task',(req,res,next) => {
    res.status(201);
    res.send("POST request to new task");
  });

  app.put('/api/user/:id/edit',(req,res,next) => {
    const id = req.params.id;
    res.send("PUT request to the userID " + id);
  });

  app.put('/api/task/:id/delete',(req,res,next) => {
    const id = req.params.id
    res.send("PUT request to taskId" + id);
  });
  

  return app;
};

