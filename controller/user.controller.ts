import { NextFunction, Request, Response } from 'express';
import { users, xCred, platformCred } from '../db/schema'; // Assuming the schemas are in 'models'
import { sql } from 'drizzle-orm';
import { db } from '../db/config';
import { eq } from 'drizzle-orm';
import { EMAIL_REQUIRED, INVALID_EMAIL, USER_ALREADY_EXISTS, USER_CREATED_SUCCESS } from '../utils/constants';
import { HttpError, Success } from '../utils/httpResponse';
import { uuid } from 'uuidv4'

// Create a new user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("req.body: ", req.body)
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      throw new HttpError(EMAIL_REQUIRED)
    }

    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpError(INVALID_EMAIL)
    }
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser) {
      throw new HttpError(USER_ALREADY_EXISTS)
    }

    // Create the new user in the database
    const newUser = await db.insert(users).values({
        email,
        userId: uuid()
    }).returning();
    
    const response = new Success(USER_CREATED_SUCCESS, newUser);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    next(error)
  }
};
