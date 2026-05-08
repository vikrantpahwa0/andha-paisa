export const successMessages = {
  SUCCESS: "Success",
  USER_REGISTERED: "User registered",
  LOGIN_SUCCESS: "Login successful",
  OTP_SENT: "Otp sent",
  OTP_VERIFIED: "Otp verified",
  SURVEY_MODULE_MESSAGES: {
    SURVEY_CRETAED: "Survey Created",
    SURVEYS_FETCHED_SUCCESSFULLY: "Surveys Fetched Successfully",
    SURVEY_FETCHED_SUCCESSFULLY: "Survey Fetched Successfully",
    SURVEY_SUBMITTED: "Survey Submitted",
  },
  USER_FETCHED: "User fetched successfully",
  EARNINGS_FETCHED: "Earnings fetched successfully",
  USER_UPDATED: "User updated successfully",
  ACCESS_TOKEN_REFRESHED: "Access token refreshed successfully",
};

export const failureMessages = {
  SOMETHING_WENT_WRONG: "Something went wrong",
  REGISTRATION_FAILED: "Registration failed",
  LOGIN_FAILED: "Login failed",
  USER_ALREADY_EXISTS: "User already exists",
  INVALID_CREDENTIALS: "Invalid credentials",
  INVALID_METHOD: "Invalid contact method",
  NO_ACTIVE_VERIFICATION:
    "No active verification found. Please request a new OTP.",
    VERIFICATION_EXPIRED: "Verification session has expired. Please request a new OTP.",
    VERIFICATION_SESSION_USED: "Verification session has already been used. Please request a new OTP.",
  OTP_EXPIRED: "OTP has expired. Please request a new one.",
  INVALID_OTP: "Invalid OTP. Please try again.",
  EMAIL_SENDING_FAILED: "Failed to send email. Please try again later.",
  EMAIL_SERVICE_MESSAGES : {
    BREVO_API_KEY_NOT_CONFIGURED: 'BREVO_API_KEY not configured in environment variables'
  },
  SURVEY_ACCESS_DENIED: "You don't have access to this survey",
  SURVEY_NOT_FOUND: "Survey not found",
  USER_NOT_FOUND : "User not found",
  INVALID_TOKEN : "Invalid token",
  TOKEN_EXPIRED : "Token has expired",
  CONFIG_MESSAGES: {
    NOT_FOUND: "Configuration key not found",
    INVALID_VALUE: "Configuration value could not be parsed",
    FETCH_FAILED: "Failed to retrieve configuration",
  },
  CONFIG_MESSAGES: {
  NOT_FOUND: "Configuration key not found",
},
};

export const httpCodes = {
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

export const validationMessages = {
  EMAIL_MOBILE_REQUIRED: "Either email or mobile number is required",
  COUNTRY_CODE_REQUIRED: "Country Code is Required",
  OTP_REQUIRED: "OTP is required",
  SURVEY_MESSAGES : {
    NAME_REWARD_REQUIRED: "Name and reward are required for active surveys",
    QUESTIONS_REQUIRED: "At least one question is required",
  },
  TOKEN_REQUIRED : 'Authorization token is required',
  TOKEN_EXPIRED :'Authorization token has expired',
  INVALID_TOKEN : 'Invalid Token',
  TOKEN_VERIFICATION_FAILED : 'Token verification failed',
  UNAUTHORIZED :'You are not authorized to access this resource',
  SURVEY_MODULE_MESSAGES: {
    INVALID_SUBMISSION_DATA: "Invalid submission data. Please check your answers.",
    QUESTION_NOT_FOUND:'Question not found in the survey',
    QUESTION_ID_REQUIRED:'Question ID is required for each answer',
    OPTION_REQUIRED:'Option chosen is required for multiple choice questions',
    OPTION_NOT_FOUND:'Chosen option not found for the question',
    TEXT_ANSWER_REQUIRED:'Text answer is required for text type questions',
    MISSING_ANSWERS:'Missing answers for questions',
  },
  CONFIG_MESSAGES: {
  CODES_ARRAY_REQUIRED: "Codes must be a non-empty array",
},
};
