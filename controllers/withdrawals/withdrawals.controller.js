import * as approvalsService from "../../services/withdrawals/withdrawals.js";
import { successResponse, errorResponse } from "../../constants/response.js";
import {
  httpCodes,
  failureMessages,
  successMessages,
} from "../../constants/messages.js";

export const createWithdrawal = async (req, res) => {
  try {
    const transactions = await approvalsService.createUpdateWithdrawal(req.body, req.user.userId);
    return successResponse(
      res,
      transactions,
      successMessages.SUCCESS,
      httpCodes.OK,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const listWithdrawalRequests = async (req, res) => {
  try {
    const transactions = await approvalsService.listWithdrawalRequests(req.user.userId);
    return successResponse(
      res,
      transactions,
      successMessages.SUCCESS,
      httpCodes.OK,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const listAllWithdrawalRequests = async (req, res) => {
  try {
    const transactions = await approvalsService.listAllWithdrawalRequests();
    return successResponse(
      res,
      transactions,
      successMessages.SUCCESS,
      httpCodes.OK,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const updateWithdrawalStatus = async (req, res) => {
  try {
    const transactions = await approvalsService.updateWithdrawalStatus(req.body);
    return successResponse(
      res,
      transactions,
      successMessages.SUCCESS,
      httpCodes.OK,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};
