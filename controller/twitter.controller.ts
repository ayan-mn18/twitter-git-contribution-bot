// src/controllers/twitterController.ts
import { NextFunction, Request, Response } from 'express';
import { User, users, XCred, xCred } from '../db/schema'; // Assuming the schemas are defined in this file
import { db } from '../db/config';
import { eq } from 'drizzle-orm';
import { TWITTER_USERNAME_REQUIRED, X_CRED_REQUIRED, USER_NOT_FOUND, TWITTER_ACCOUNT_ADDED_SUCCESS, INVALID_TWITTER_USERNAME } from '../utils/constants';
import { HttpError, Success } from '../utils/httpResponse';
import { XCredentials } from '../types';
import { uuid } from 'uuidv4';

// Add a Twitter account for a user
// export const addTwitterAccount = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { userId } = req.params;
//     const { twitterUsername, xCredentials }: { twitterUsername: string, xCredentials: XCredentials} = req.body;

//     console.log('userId: ', userId)
//     console.log('xCredentials: ', xCredentials)

//     // Check if the user exists
//     const user = await db.query.users.findFirst({
//       where: eq(users.userId, userId),
//     });

//     if (!user) {
//       throw new HttpError(USER_NOT_FOUND);
//     }

//     // Check if twitter username is provided
//     if (!twitterUsername) {
//       throw new HttpError(TWITTER_USERNAME_REQUIRED);
//     }

//     // Check if the Twitter username format is valid (basic validation)
//     const twitterUsernameRegex = /^[A-Za-z0-9_]{1,15}$/;
//     if (!twitterUsernameRegex.test(twitterUsername)) {
//       throw new HttpError(INVALID_TWITTER_USERNAME);
//     }

//     // Check if Twitter credentials are provided
//     if (!xCredentials || !xCredentials.apiKey || !xCredentials.apiSecret || !xCredentials.accessToken || !xCredentials.accessSecret) {
//       throw new HttpError(X_CRED_REQUIRED);
//     }

//     // Insert new xCred to database
//     const [newXCred] = await db.insert(xCred).values({
//       id: uuid(),
//       apiKey: xCredentials.apiKey,
//       apiSecret: xCredentials.apiSecret,
//       accessToken: xCredentials.accessToken,
//       accessSecret: xCredentials.accessSecret,
//     }).returning() as [XCred];

//     // Update the user with the new Twitter username and xCredId
//     const [updatedUser] = await db.update(users)
//       .set({
//         twitterUsername: twitterUsername,
//         xCredId: newXCred.id, // Assuming the id returned is the xCred ID
//       })
//       .where(eq(users.userId, userId))
//       .returning() as [User];

//     // Return success response
//     const response = new Success(TWITTER_ACCOUNT_ADDED_SUCCESS, updatedUser);
//     res.status(response.statusCode).json(response);

//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };
