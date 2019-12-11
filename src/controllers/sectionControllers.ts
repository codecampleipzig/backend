import { Request, Response, NextFunction } from "express";
import { query } from "../db";
import { QueryResult } from "pg";
import { Project } from "src/datatypes/Project";

export const createSection = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const projectId = req.params.projectId;
    const { title, description, due } = req.body;
    const status = req.body.sectionStatus || "open";
    const creator = parseInt(req.body.creator);

    if (!title || !description || Number.isNaN(creator) || !due) {
      res.status(500).send("Not a valid section");
    }

    await query(
      `INSERT INTO sections(project_id, section_title, section_description, section_due, section_status, section_creator) 
      VALUES($1, $2, $3, $4, $5, $6)`,
      [projectId, title, description, due, status, creator],
    );
    next();
  } catch (error) {
    next(error);
  }
}
