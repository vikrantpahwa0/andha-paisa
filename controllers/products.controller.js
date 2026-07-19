import * as productService from "../services/products.services.js";
import { successResponse, errorResponse } from "../constants/response.js";
import {
  httpCodes,
  failureMessages,
  successMessages,
} from "../constants/messages.js";

export const createUpdateProducts = async (req, res) => {
  try {
    const survey = await productService.createUpdateProducts(req.body);
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

export const listProducts = async (req, res) => {
  try {
    const surveys = await productService.listProducts();
    return successResponse(
      res,
      surveys,
      successMessages.SURVEY_MODULE_MESSAGES.SURVEYS_FETCHED_SUCCESSFULLY,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};

export const listCategories = async (req, res) => {
  try {
    const surveys = await productService.listCategories();
    return successResponse(
      res,
      surveys,
      successMessages.SURVEY_MODULE_MESSAGES.SURVEYS_FETCHED_SUCCESSFULLY,
      httpCodes.SUCCESS,
    );
  } catch (err) {
    return errorResponse(res, err.message, httpCodes.BAD_REQUEST, err);
  }
};
