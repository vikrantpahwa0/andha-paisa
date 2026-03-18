import { failureMessages, httpCodes, successMessages } from "./messages";

export const successResponse = (
  res,
  data = null,
  message = successMessages.SUCCESS,
  status = httpCodes.SUCCESS,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    error: null,
  });
};

export const errorResponse = (
  res,
  message = failureMessages.SOMETHING_WENT_WRONG,
  status = httpCodes.SUCCESS,
  error = null,
) => {
  return res.status(status).json({
    success: false,
    message,
    data: null,
    error,
  });
};
