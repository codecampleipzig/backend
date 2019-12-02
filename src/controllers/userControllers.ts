import { Request, Response, NextFunction } from "express";
import { query } from "./../db";
import { QueryResult } from "pg";
import { bcrypt } from "bcryptjs";
import { jwt } from "jsonwebtoken";
import { users } from "../mockdata";

export const getUser = (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = users.find(user => user.userId == parseInt(id));
  res.send({ userId });
};

export const registerUser = (req: Request, res: Response, next: NextFunction) => {
  // take user data from req.body
  // make checks for name, email and password (if there are values; if values are allowed), if ok:
  // make checks for email address if already exists in DB, if not:
  // hash user password by using bcrypt
  // write user to DB
  // return response


  res.status(201);
  res.send("POST request to the register page");
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
// take user data from req.body
// make checks for name/email and password (if there are values, if values are allowed), if ok:
// find user in DB based on email and password
// if not found, return message, status 404 (Not a good practice, but leave it for now)
// if found, check if password is correct (using bcrypt.compare method)
//  if entered password doesn't match, return 401 message
//  if entered password matches, return success and set access token with jwt.sign 
// return response/redirect?
}

export const editUser = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send("PUT request to the userID " + id);
};

export const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send("PUT request to taskId" + id);
};
