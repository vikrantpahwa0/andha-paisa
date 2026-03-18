export const successMessages = {
  SUCCESS: "Success",
  USER_REGISTERED: "User registered",
  LOGIN_SUCCESS: "Login successful",
  OTP_SENT: "Otp sent",
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
};

export const httpCodes = {
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
};

export const validationMessages = {
  EMAIL_MOBILE_REQUIRED: "Either email or mobile number is required",
  COUNTRY_CODE_REQUIRED: "Country Code is Required",
  OTP_REQUIRED: "OTP is required",
};
