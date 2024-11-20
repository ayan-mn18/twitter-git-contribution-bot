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