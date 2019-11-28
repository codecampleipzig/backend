import { Request, Response, NextFunction } from "express";
import { query } from "../db";


export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbResponse = await query("SELECT * from users WHERE user_id = $1", [req.params.id]);
    if (dbResponse.rows.length == 1) {
      res.send({ project: dbResponse.rows[0] });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const name = body.userName;
    const email = body.userEmail;
    const password = body.userPassword;
    const imageURL = body.userImageURL;
    const joinDate = body.joinDate;
  
    if (!name || !email || !password || !imageURL || joinDate ) {
      throw new Error("Not a valid user");
    }

    await query(
      "INSERT INTO users(user_name, user_email, password, user_image_url, join_date) VALUES($1, $2, $3, $4, $5)",
      [name, email, password, imageURL, joinDate],
    );
    res.status(201).send({ status: "ok" });
  } catch (error) {
    next(error);
  }
};

export const editUser = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send("PUT request to the userID " + id);
};

export const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send("PUT request to taskId" + id);
};
