import { NextFunction, Request, Response } from 'express';
import { users } from '../db/schema'; // Assuming the schemas are in 'models'
import { db } from '../db/config';
import { eq } from 'drizzle-orm';
import { EMAIL_REQUIRED, INVALID_EMAIL, USER_ALREADY_EXISTS, USER_CREATED_SUCCESS, USER_DELETED_SUCCESS, USER_ID_REQUIRED, USER_NOT_FOUND } from '../utils/constants';
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

// Delete a user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    // Check if userId is provided
    if (!userId) {
      throw new HttpError(USER_ID_REQUIRED);
    }

    // Find the user in the database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.userId, userId)
    });

    // If user does not exist
    if (!existingUser) {
      throw new HttpError(USER_NOT_FOUND);
    }

    // Delete the user from the database
    const deletedUser = await db.delete(users).where(eq(users.userId, userId));

    // Send success response
    const response = new Success(USER_DELETED_SUCCESS, deletedUser);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
};