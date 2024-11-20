export type apiResponse<T = any> = {
  statusCode: Number,
  message: String,
  data: T
}
