import { Request, Response, NextFunction } from "express";
import { query } from "./../db";
import { QueryResult } from "pg";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { User } from "./../datatypes/User";
import { secret } from "./../configuration/index";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbResponse = await query(`SELECT * from users WHERE user_id = $1`, [req.params.userId]);
    if (dbResponse.rows.length == 1) {
      res.send({ project: dbResponse.rows[0] });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Register user - user data validations, database check for non-existing user and returning user data and token in response
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Take user data from req.body
    const { username, email, password } = req.body;
    // Check for value in name, email and password - required fields validation
    if (!username || !email || !password) {
      return res.status(400).send({ message: "Username, email or password required." });
    }

    // TODO: Check for expected value in name, email and password - valid data format
    const usernameRegex = RegExp("^[^\\d\\s](\\S+ ){0,1}\\S+$");
    const emailRegex = RegExp("^(([^<>()\\[\\]\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$");
    // Old password validator: "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}"
    const passwordRegex = RegExp("^(?=(.*[A-Za-z]){1,})(?=(.*[\\d]){1,})(?!.*\\s).{8,}$");

    if (!usernameRegex.test(username)) {
      return res.status(400).send({ message: `Username: ${username} must contain at least two characters, no number at the beginning and no whitespace around.` });
    }

    // email: standard email format validation a@a.a
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: `Email address ${email} must have valid email address format.` });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).send({ message: "Your password must be at least 8 characters and contain at least one number." })
    }

    // TODO: Don't we have to have Confirm Password field on Register form?
    // If yes, then check if password confirmation matches password field

    // Check that email address does not already exist in DB
    const dbUserCheck: QueryResult<any> = await query(
      `SELECT * 
      FROM users 
      WHERE LOWER(user_email) = $1 OR user_name = $2`,
      [email.toLowerCase(), username]);

    if (dbUserCheck.rows[0]) {
      return res.status(400).send({ message: "Registration not successful. You may already have an account!" })
    }

    // Once registration data checks pass, hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const { rows } = await query(
      `INSERT INTO users (user_name, user_email, password)
      VALUES ($1, $2, $3) RETURNING *`,
      [username, email, hashedPassword]
    );

    const dbUser = rows[0];

    const user = mapToJwtUserModel(dbUser);

    // Once user is created, return success and set access token 
    // Authorization
    const accessToken: string = jwt.sign(user, secret);

    // Return success response
    return res.send({
      user,
      message: "You have registered successfully!",
      token: accessToken
    })
  }
  catch (error) {
    next(error);
  }
};

/* Login user - user data validations, database check for existing user and returning user data and token in response
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  // Take user data from req.body
  const { email, password } = req.body;

  // Check for value in name, email and password - required fields validation
  if (!email || !password) {
    return res.status(400).send({ message: "Email or password required." });
  }

  // Find user in DB based on email
  const dbUserCheck: QueryResult<any> = await query(
    `SELECT * 
    FROM users 
    WHERE LOWER(user_email) = $1`,
    [email.toLowerCase()]
  );

  const dbUser = dbUserCheck.rows[0];

  // If not found, return message, status 403 (Not a good practice, but leave it for now)
  if (!dbUser) {
    return res.status(403).send({ message: "Incorrect credentials, please try again." })
  }

  // If found, check for password match
  const passwordMatch: boolean = await bcrypt.compare(password, dbUser.password);

  // If entered password doesn't match, return 401 message
  if (!passwordMatch) {
    res.status(401).send({ message: "Incorrect credentials, please try again." });
  }
  else {
    // If entered password matches, return success and set access token 
    // Authorization
    const user = mapToJwtUserModel(dbUser);

    const accessToken: string = jwt.sign(user, secret);
    res.send({
      user,
      message: "You have logged in successfully!",
      token: accessToken
    });
  }
}

function mapToJwtUserModel(dbUser: any): User {
  const user: User = {
    userId: dbUser.userId,
    userName: dbUser.userName,
    userEmail: dbUser.userEmail,
    userImageUrl: dbUser.userImageUrl
  };

  return user;
}

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId;
    const { userName, userEmail, userImageUrl } = req.body;
    const dbResponse = await query(
      `UPDATE users SET user_name = $1, user_email = $2, user_image_url = $3
      WHERE user_id = $3 Returning *`,
      [userName, userEmail, userImageUrl, id],
    );
    res.send({ users: dbResponse.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const dbResponse = await query(`DELETE FROM users WHERE user_id = $1 RETURNING id`, [userId]);
    res.send({ userId });
  } catch (error) {
    next(error);
  }
};
