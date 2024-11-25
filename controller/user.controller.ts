import { NextFunction, Request, Response } from 'express';
import { users, xCred } from '../db/schema'; // Assuming the schemas are in 'models'
import { db } from '../db/config';
import { eq } from 'drizzle-orm';
import { EMAIL_REQUIRED, INVALID_EMAIL, TOKENS_REQUIRED_TO_SIGN_IN, TWITTER_USERNAME_ERROR, USER_ALREADY_EXISTS, USER_CREATED_SUCCESS, USER_DELETED_SUCCESS, USER_ID_REQUIRED, USER_NOT_FOUND } from '../utils/constants';
import { HttpError, Success } from '../utils/httpResponse';
import { uuid } from 'uuidv4'
import { TwitterApiErrorResponse, TwitterGetUserDetailsApiResponse } from '../types';

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

// SignIn User
export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("req.body: ", req.body);
    const { accessToken, refreshToken } = req.body;

    // Validate input
    if (!accessToken || !refreshToken) {
      throw new HttpError(TOKENS_REQUIRED_TO_SIGN_IN);
    }

    // Call Twitter API to get the user's username
    const twitterResponse = await fetch("https://api.twitter.com/2/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!twitterResponse.ok) {
      const errorData = await twitterResponse.json() as TwitterApiErrorResponse ;
      throw new HttpError({ message: `Twitter API Error: ${errorData.message || "Unknown error"}`, statusCode: 400});
    }

    const twitterUser: TwitterGetUserDetailsApiResponse = await twitterResponse.json() as TwitterGetUserDetailsApiResponse;
    const twitterUsername = twitterUser.data.username;

    if (!twitterUsername) {
      throw new HttpError(TWITTER_USERNAME_ERROR);
    }

    // Check if the user already exists in the database
    let xCredentials = await db.query.xCred.findFirst({
      where: eq(xCred.twitterUsername, twitterUsername),
    });

    let user ;

    if (xCredentials) {
      // Update the tokens for the existing user
      await db
        .update(xCred)
        .set({
          accessToken,
          refreshToken,
        })
        .where(eq(xCred.twitterUsername, twitterUsername));

      user = await db.query.users.findFirst({
        where: eq(users.userId, xCredentials.userId as string)
      })
    } else {
      // Create a new user
      user = db.insert(users).values({
        userId: uuid(),
      }).returning().get();

      // Create new credentials for the user
      await db.insert(xCred).values({
        id: uuid(),
        userId: user.userId,
        accessToken,
        refreshToken,
        twitterUsername
      });
    }

    // Respond with success
    const response = new Success("User signed in successfully", { user, twitterUsername });
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    next(error);
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