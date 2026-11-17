import * as applicationService from "../services/applications.service.js";
import { successResponse, errorResponse } from "../constants/response.js";
import { httpCodes, successMessages } from "../constants/messages.js";

export const sendApplication = async (req, res) => {
  try {
    const result = await applicationService.sendApplication(req.body);
    return successResponse(
      res,
      result,
      successMessages.APPLICATION_SENT,
      httpCodes.CREATED,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const fetchApplications = async (req, res) => {
  try {
    const applications = await applicationService.fetchApplications(req.query);
    return successResponse(
      res,
      applications,
      successMessages.APPLICATIONS_FETCHED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const fetchApplicationById = async (req, res) => {
  try {
    const application = await applicationService.fetchApplicationById(
      req.params.id,
    );
    return successResponse(
      res,
      application,
      successMessages.APPLICATIONS_FETCHED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.NOT_FOUND, err);
  }
};
