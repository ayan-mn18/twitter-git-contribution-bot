import { eq } from "drizzle-orm"
import { db } from "../db/config"
import { xCred } from "../db/schema"
import axios from "axios";
import { XConfig } from "../config/config";
import { XTokens } from "../types";

export const getAccessToken = async (userId: string) => {
  try {
    console.log("userId: ", userId)
    const usersXCred = await db.query.xCred.findFirst({
      where: eq(xCred.userId, userId)
    })
    console.log("usersXCred: ", usersXCred)
  
    const refreshToken = usersXCred?.refreshToken;

    if (!refreshToken) throw new Error("user not signed in properlyyyy");

    const tokens: XTokens | null = await getAccessTokenFromRefreshToken(refreshToken);
    if(!tokens) throw new Error("user not signed in properly")
      
    const newAccessToken = tokens.accessToken;
    const newRefreshToken = tokens.refreshToken;

    if (!newAccessToken) {
      throw new Error("user not signed in properly")
    } 

    await db.update(xCred).set({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }).where(eq(xCred.userId, userId))

    return tokens;

  } catch (error) {
    return error
  }
}

export const getAccessTokenFromRefreshToken = async (refreshToken: string): Promise<XTokens | null> => {
  try {
    const url = "https://api.x.com/2/oauth2/token";

    // Retrieve the Base64 encoding from environment variables
    const basicAuthToken = XConfig.base64Encoding;
    if (!basicAuthToken) {
      throw new Error("Missing BASE64ENCODING environment variable");
    }

    const response = await axios.post(
      url,
      new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuthToken}`,
        },
      }
    );

    // Extract and return the access token
    
    return {
      refreshToken: response.data.refresh_token,
      accessToken: response.data.access_token
    } as XTokens;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};
