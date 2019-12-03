import { Request, Response, NextFunction } from "express";
import { query } from "./../db";
import { QueryResult } from "pg";
// import { bcrypt } from "bcryptjs";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { users } from "../mockdata";

// Generate private key with jwt using the following command in node:
// require('crypto').randomBytes(64).toString('hex')
const secret = "fbf50189319aa851c000ded939929376c7fdfc040993c6ebf71477baf6c008ea09dcb041616358c001b7230f6f06b6d46b006c26f154e50a6f160caaf30f7a42";

export const getUser = (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = users.find(user => user.userId == parseInt(id));
  res.send({ userId });
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // take user data from req.body
    const { username, email, password } = req.body;
    // check for value in name, email and password - required fields validation
    if (!username || !email || !password) {
      return res.status(400).send({ message: "Username, email or password required." });
    }
    // TODO: check for expected value in name, email and password - valid data format
    // name: string containing letters, numbers?, special characters?
    // email: standard email format validation a@a.a
    // password: Your password must contain an uppercase, a lowercase, a special character and a number.

    // Don't we have to have Confirm Password field on Register form?
    // TODO: If yes, then check if password confirmation matches password field

    // check that email address does not already exist in DB:
    const dbUserCheck: QueryResult<any> = await query(
      `SELECT * 
      FROM users 
      WHERE user_email = $1`,
      [email]);

    // 422 OR 400 OR 409 (resource conflict) when a record already exists.
    //"You will receive a confirmation email on the next minutes if you don't have an account, if you don't receive the email try forget password"
    if (dbUserCheck.rows[0]) {
      return res.status(422).send({ message: "Registration not successful." })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const { rows } = await query(
      `INSERT INTO users (user_name, user_email, password)
      VALUES ($1, $2, $3) RETURNING *`,
      [username, email, hashedPassword]
    );
    // return response
    res.send({
      message: "User registered successfully",
      user: rows
    })
  }
  catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  // take user data from req.body
  
  const { email, password } = req.body;

  // check for value in name, email and password - required fields validation
  if (!email || !password) {
    return res.status(400).send({ message: "Email or password required." });
  }


  // TODO: check for expected value in name, email and password - valid data format
  // name: string containing letters, numbers?, special characters?
  // email: standard email format validation a@a.a
  // password: Your password must contain an uppercase, a lowercase, a special character and a number.

  // find user in DB based on email
  const dbUserCheck: QueryResult<any> = await query(
    `SELECT * 
    FROM users 
    WHERE user_email = $1`,
    [email]
  );

  // if not found, return message, status 404 (Not a good practice, but leave it for now)
  const user = dbUserCheck.rows[0];

  if (!user) {
    return res.status(404).send({ message: "User with that email not found - Incorrect credentials, please try again." })
  }

  const passwordMatch: boolean = await bcrypt.compare(password, user.password);

  // if found, check if password is correct (using bcrypt.compare method)
  if (!passwordMatch) {
    //  if entered password doesn't match, return 401 message
    res.status(401).send({ message: "Password is not correct - Incorrect credentials, please try again." });
  } else {
    //  if entered password matches, return success and set access token with jwt.sign 
    // Authorization
    const accessToken: string = jwt.sign(user, secret);
    res.send({
      message: "User logged in successfully.",
      token: accessToken
    })
  }


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
