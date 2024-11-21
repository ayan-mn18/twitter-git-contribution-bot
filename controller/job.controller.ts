// Edit jobs

import { Request, Response, NextFunction } from "express";
import { db } from "../db/config";
import { users } from "../db/schema";
import { EditJobParams, EditJobReqBody } from "../types";
import { HttpError, Success } from "../utils/httpResponse";
import { INCORRECT_JOB_DETAILS, JOB_ACTIVATE_SUCCESS, JOB_DEACTIVATE_SUCCESS, JOB_UPDATED_SUCCESS, USER_NOT_FOUND } from "../utils/constants";
import { eq } from "drizzle-orm";
import { getCronPattern, getTimezoneIdentifier, isValidJobFrequency, isValidJobStartTime, isValidTimezone } from "../utils/jobDetailsValidator";
import { activateJob, queue } from "../jobs/tweet-scheduler";
import { stopUserJobs } from "../config/SetupBullBoard";

export const editJobController = async (req: Request<EditJobParams, unknown, EditJobReqBody>, res: Response, next: NextFunction) => {
  try {

    const { userId } = req.params;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.userId, userId)
    });

    if (!existingUser) {
      throw new HttpError(USER_NOT_FOUND)
    }

    const {
      leetcode_username,
      github_username,
      bitbucket_username,
      timezone,
      jobFrequency,
      jobStartTime,
    } = req.body;

    if(!isValidJobFrequency(jobFrequency) || !isValidJobStartTime(jobStartTime) || !isValidTimezone(timezone)) {
      throw new HttpError(INCORRECT_JOB_DETAILS)
    }

    // TODO
    // ADD a logic or lib to check if all the fields are coming

    const updatedUser = db.update(users)
    .set({
      leetcode_username: leetcode_username,
      github_username: github_username,
      bitbucket_username: bitbucket_username,
      timezone: timezone,
      jobFrequency: jobFrequency,
      jobStartTime: jobStartTime
    })
    .where(eq(users.userId, userId))
    .returning().get()

    const timezoneDetail = getTimezoneIdentifier(updatedUser.timezone!)
    const jobFrequencyCronPattern = getCronPattern(updatedUser.jobFrequency!)
    const email = updatedUser.email

    await activateJob(jobFrequencyCronPattern, timezone, email, userId);

    const response = new Success(JOB_UPDATED_SUCCESS, { updatedUser });
    res.status(response.statusCode).json(response);
    
  } catch (error) {
    console.error(error);
    next(error);
  }

}

export const activateJobController = async (req: Request<EditJobParams, unknown, EditJobReqBody>, res: Response, next: NextFunction) => {
  try {

    const { userId } = req.params;

    // Check if user already exists
    const user = await db.query.users.findFirst({
      where: eq(users.userId, userId)
    });

    if (!user) {
      throw new HttpError(USER_NOT_FOUND)
    }

    const timezone = getTimezoneIdentifier(user.timezone!)
    const jobFrequencyCronPattern = getCronPattern(user.jobFrequency!)
    const email = user.email

    await activateJob(jobFrequencyCronPattern, timezone, email, userId);

    const response = new Success(JOB_ACTIVATE_SUCCESS, user);
    res.status(response.statusCode).json(response);
    
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const deActivateJobController = async (req: Request<EditJobParams, unknown, EditJobReqBody>, res: Response, next: NextFunction) => {
  try {

    const { userId } = req.params;

    // Check if user already exists
    const user = await db.query.users.findFirst({
      where: eq(users.userId, userId)
    });

    if (!user) {
      throw new HttpError(USER_NOT_FOUND)
    }

    await stopUserJobs(queue, userId);

    const response = new Success(JOB_DEACTIVATE_SUCCESS, {JOB_DEACTIVATE_SUCCESS});
    res.status(response.statusCode).json(response);
    
  } catch (error) {
    console.error(error);
    next(error);
  }
}