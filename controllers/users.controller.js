import * as userService from "../services/users.service.js";
import { successResponse, errorResponse } from "../constants/response.js";
import {
  httpCodes,
  failureMessages,
  successMessages,
} from "../constants/messages.js";

export const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    return successResponse(
      res,
      user,
      successMessages.USER_REGISTERED,
      httpCodes.CREATED,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const loginUser = async (req, res) => {
  try {
    const token = await userService.loginUser(req.body);
    return successResponse(
      res,
      { token },
      successMessages.LOGIN_SUCCESS,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.UNAUTHORIZED, err);
  }
};

export const sendOtp = async (req, res) => {
  try {
    await userService.sendOtp(req.body);
    return successResponse(
      res,
      null,
      successMessages.OTP_SENT,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.UNAUTHORIZED, err);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const verifyOtp = await userService.verifyOtp(req.body);
    return successResponse(
      res,
      verifyOtp,
      successMessages.OTP_VERIFIED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.UNAUTHORIZED, err);
  }
};
