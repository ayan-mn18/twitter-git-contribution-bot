export type apiResponse<T = any> = {
  statusCode: Number,
  message: String,
  data: T
}

export type XCredentials = {
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessSecret: string
}

export type EditJobReqBody = {
  leetcode_username?: string | null;
  github_username?: string | null;
  bitbucket_username?: string | null;
  timezone?: "IST" | "UTC" | "GMT";
  jobFrequency?: "24hrs" | "12hrs" | "6hrs";
  jobStartTime?: string; 
}

export type EditJobParams = {
  userId: string
}

export type TwitterGetUserDetailsApiResponse = {
  data: {
    username: string
    id: string
    name: string
  }
}

export type TwitterApiErrorResponse = {
  error: string
  message: string
}