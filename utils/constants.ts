// ERRORS
export const EMAIL_REQUIRED = { message: 'Email is required.', statusCode: 400 }
export const INVALID_EMAIL = { message: 'Please provide a valid email address.', statusCode: 400 }
export const USER_ALREADY_EXISTS = { message: 'A user with this email already exists.', statusCode: 400 }
export const USER_ID_REQUIRED = { message: 'UserId is required', statusCode: 400 }
export const USER_NOT_FOUND = { message: 'User not found, Incorrect userId', statusCode: 400 }
export const TWITTER_USERNAME_REQUIRED = { message: 'Twitter username is required.', statusCode: 400 };
export const X_CRED_REQUIRED = { message: 'Twitter credentials (API Key, API Secret, Access Token, Access Secret) are required.', statusCode: 400 };
export const INVALID_TWITTER_USERNAME = { message: 'Invalid Twitter username format.', statusCode: 400 };
export const TWITTER_USERNAME_ALREADY_REGISTERED = { message: 'Twitter username is already registered use another one', statusCode: 400 };







// SUCCESS
export const USER_CREATED_SUCCESS = 'User created successfully.'
export const USER_DELETED_SUCCESS = 'User deleted successfully.'
export const TWITTER_ACCOUNT_ADDED_SUCCESS = 'Twitter account added successfully.';
export const TWEETS_FETCHED_SUCCESSFULLY = 'Tweets fetched successfully.';

