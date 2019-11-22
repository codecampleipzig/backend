import { Request, Response } from 'express';

import { projects } from '../mockdata';

export const getProjects = (req: Request, res: Response) => {
  res.send({ projects });
};

export const getProject = (req: Request, res: Response) => {
  const id = req.params.id;
  const projectId = projects.find(project => project.projectId == parseInt(id));
  res.send({ projectId });
};

export const createProject = (req: Request, res: Response) => {
  res.status(201);
  res.send('POST request to new project page');
};

export const getUserProjects = (req: Request, res: Response) => {
  const userId = req.params.userId;
  const myProjects = projects.filter(project => project.projectTeam.some(user => user.userId == parseInt(userId)));
  res.send({ myProjects });
};

export const getExploreProjects = (req: Request, res: Response) => {
  const userId = req.params.userId;
  const exploreProjects = projects.filter(
    project => !project.projectTeam.some(user => user.userId == parseInt(userId)),
  );
  res.send({ exploreProjects });
};
