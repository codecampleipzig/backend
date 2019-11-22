import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

export const getApp = () => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/api/v1/test', (_, res) => {
    res.json({ ok: true });
  });

  app.get('/api/projects', (req, res) => {

  })

  app.post('/api/projects', (req, res) => {
    const newProject = req.body;
    res.send(newProject)
  });

  return app;
};
