import * as approvalsService from "../services/approvals.service.js";
import { successResponse, errorResponse } from "../constants/response.js";
import {
  httpCodes,
  failureMessages,
  successMessages,
} from "../constants/messages.js";

export const fetchWithdrawableTransactions = async (req, res) => {
  try {
    const transactions = await approvalsService.fetchWithdrawableTransactions();
    return successResponse(
      res,
      transactions,
      successMessages.TRANSACTIONS_FETCHED,
      httpCodes.OK,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const approveReject = async (req, res) => {
  try {
    const transactions = await approvalsService.approveReject(req.body);
    return successResponse(
      res,
      transactions,
      successMessages.STATUS_UPDATED,
      httpCodes.OK,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};
