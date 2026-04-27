import * as surveyService from "../services/surveys.service.js";
import { successResponse, errorResponse } from "../constants/response.js";
import {
  httpCodes,
  failureMessages,
  successMessages,
} from "../constants/messages.js";

export const createUpdateSurveys = async (req, res) => {
  try {
    const survey = await surveyService.createUpdateSurveys(req.body);
    return successResponse(
      res,
      survey,
      successMessages.SURVEY_MODULE_MESSAGES.SURVEY_CRETAED,
      httpCodes.CREATED,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};
