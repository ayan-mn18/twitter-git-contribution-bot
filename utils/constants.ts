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
export const INCORRECT_JOB_DETAILS = { message: 'Incorrect job frequency, job start time or timezone provided', statusCode: 400 };
export const TOKENS_REQUIRED_TO_SIGN_IN = { message: 'AccessToken and RefreshToken are required to sign in', statusCode: 400 };
export const TWITTER_USERNAME_ERROR = { message: 'Unable to retrieve Twitter username', statusCode: 400 };





// SUCCESS
export const USER_CREATED_SUCCESS = 'User created successfully.'
export const USER_DELETED_SUCCESS = 'User deleted successfully.'
export const TWITTER_ACCOUNT_ADDED_SUCCESS = 'Twitter account added successfully.';
export const TWEETS_FETCHED_SUCCESSFULLY = 'Tweets fetched successfully.';
export const JOB_UPDATED_SUCCESS = 'Jobs updated successfully.';
export const JOB_ACTIVATE_SUCCESS = 'Job activated successfully.';
export const JOB_DEACTIVATE_SUCCESS = 'Job deactivated successfully.';