export const successMessages = {
  SUCCESS: "Success",
  USER_REGISTERED: "User registered",
  LOGIN_SUCCESS: "Login successful",
  OTP_SENT: "Otp sent",
  SURVEY_MODULE_MESSAGES: {
    SURVEY_CRETAED: "Survey Created",
    SURVEYS_FETCHED_SUCCESSFULLY: "Surveys Fetched Successfully",
  },
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
  OTP_EXPIRED: "OTP has expired. Please request a new one.",
  INVALID_OTP: "Invalid OTP. Please try again.",
  EMAIL_SENDING_FAILED: "Failed to send email. Please try again later.",
  EMAIL_SERVICE_MESSAGES : {
    BREVO_API_KEY_NOT_CONFIGURED: 'BREVO_API_KEY not configured in environment variables'
  }
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
};
