import { Request, Response, NextFunction } from "express";


import { db } from "../db/config";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import axios from "axios";
import { HttpError } from "../utils/httpResponse";


export const checkValidGithubUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {githubUsername, userId} = req.body;

    if(!githubUsername) {
      res.status(400).json({
        message: "Github username is required",
        data: {
          valid: false
        }
      });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.github_username, githubUsername)
    });

    if (user) {
      res.status(500).json({
        message: "Username already exists",
        data: {
          valid: false
        }
      });
      return;
    } 

    const validUsername = await axios.get(`https://api.github.com/users/${githubUsername}`);

    if (validUsername.status !== 200) {
      res.status(500).json({
        message: "Username does not exist",
        data: {
          valid: false
        }
      });
      return;
    }

    // add github username to user
    await db.update(users)
          .set({github_username: githubUsername})
          .where(eq(users.userId, userId));

    res.status(200).json({
      message: "Username is available",
      data: {
        valid: true
      }
    });
    
  } catch (error) {
    console.error(error);
    next(error);
  }

}

export const checkValidLeetcodeUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {leetcodeUsername, userId} = req.body;

    console.log("req.body: ", req.body);

    if(!leetcodeUsername) {
      throw new HttpError({ message: "Leetcode username is required", statusCode: 400 });

    }

    const user = await db.query.users.findFirst({
      where: eq(users.leetcode_username, leetcodeUsername)
    });

    if (user) {
      throw new HttpError({ message: "Username already exists", statusCode: 400 });
    } 

    const query = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats {
              totalSubmissionNum {
                count
              }
            }
          }
        }
      `,
      variables: { username: leetcodeUsername }
    };  

    const response = await axios.post("https://leetcode.com/graphql", query, {
      headers: {
        "Content-Type": "application/json",
      },
    });


    if (!response.data.data.matchedUser) {
      throw new HttpError({ message: "Username does not exist", statusCode: 400 });
    }

    // add leetcode username to user
    await db.update(users)
          .set({leetcode_username: leetcodeUsername})
          .where(eq(users.userId, userId));

    res.status(200).json({
      message: "Username is available",
      data: {
        valid: true
      }
    });
    
  } catch (error) {
    console.error(error);
    next(error);
  }
}