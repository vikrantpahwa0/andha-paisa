import * as templateService from "../services/templates.service.js";
import { successResponse, errorResponse } from "../constants/response.js";
import { httpCodes, successMessages } from "../constants/messages.js";

export const createTemplate = async (req, res) => {
  try {
    const template = await templateService.createTemplate(req.body, req.file);
    return successResponse(
      res,
      template,
      successMessages.TEMPLATE_CREATED,
      httpCodes.CREATED,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const fetchTemplates = async (req, res) => {
  try {
    const templates = await templateService.fetchTemplates(req.query);
    return successResponse(
      res,
      templates,
      successMessages.TEMPLATES_FETCHED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const fetchTemplateById = async (req, res) => {
  try {
    const template = await templateService.fetchTemplateById(req.params.id);
    return successResponse(
      res,
      template,
      successMessages.TEMPLATE_FETCHED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.NOT_FOUND, err);
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const template = await templateService.updateTemplate(
      req.params.id,
      req.body,
      req.file,
    );
    return successResponse(
      res,
      template,
      successMessages.TEMPLATE_UPDATED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    await templateService.deleteTemplate(req.params.id);
    return successResponse(
      res,
      {},
      successMessages.TEMPLATE_DELETED,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};
