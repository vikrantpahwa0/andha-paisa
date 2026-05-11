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
    const userInfo = await userService.loginUser(req.body);
    return successResponse(
      res,
      userInfo,
      successMessages.LOGIN_SUCCESS,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.UNAUTHORIZED, err);
  }
};

export const sendOtp = async (req, res) => {
  try {
    const sendOtp = await userService.sendOtp(req.body);
    return successResponse(
      res,
      sendOtp,
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

export const refreshAccessToken = async (req, res) => {
  try {
    const user = await userService.refreshAccessToken(req.headers.authorization.substring(7));
    return successResponse(
      res,
      user,
      successMessages.ACCESS_TOKEN_REFRESHED,
      httpCodes.CREATED,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.UNAUTHORIZED, err);
  }
};

export const fetchUser = async (req, res) => {
  try {
    const user = await userService.fetchUser(req.user.userId, req.query.includeBankDetails);
    return successResponse(
      res,
      user,
      successMessages.USER_FETCHED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const updateUser = async (req, res) => {
  try {
    await userService.updateUser({ userId: req.user.userId, ...req.body });
    return successResponse(
      res,
      {},
      successMessages.USER_UPDATED,
      httpCodes.CREATED,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const fetchEarnings = async (req, res) => {
  try {
    const earnings = await userService.fetchEarnings(req.user.userId);
    return successResponse(
      res,
      earnings,
      successMessages.EARNINGS_FETCHED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const fetchTransactions = async (req, res) => {
  try {
    const earnings = await userService.fetchTransactions(req.user.userId);
    return successResponse(
      res,
      earnings,
      successMessages.EARNINGS_FETCHED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};
