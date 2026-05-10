import * as spinService from "../../services/games/spin-wheel.js";
import { successResponse, errorResponse } from "../../constants/response.js";
import { httpCodes, successMessages } from "../../constants/messages.js";

export const spinWheel = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await spinService.processSpin(userId);

    return successResponse(
      res,
      result,
      successMessages.SPIN_COMPLETED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};
