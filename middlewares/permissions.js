import db from "../database/index.js";

const { USERS } = db;

import {
  httpCodes,
  failureMessages,
  successMessages,
  validationMessages
} from "../constants/messages.js";
import { errorResponse } from "../constants/response.js";
import jwt from "jsonwebtoken";


export const authMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(
          res,
          validationMessages.TOKEN_REQUIRED,
          httpCodes.BAD_REQUEST,  // ← 401, not 400
          null
        );
      }

      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          return errorResponse(
            res,
            validationMessages.TOKEN_EXPIRED,  // ← better message
            httpCodes.UNAUTHORIZED,
            null
          );
        }
        if (jwtError.name === 'JsonWebTokenError') {
          return errorResponse(
            res,
            validationMessages.INVALID_TOKEN,
            httpCodes.BAD_REQUEST,
            null
          );
        }
        return errorResponse(
          res,
          validationMessages.TOKEN_VERIFICATION_FAILED,
          httpCodes.BAD_REQUEST,
          null
        );
      }
      
      if (requiredRole && req.user.role !== requiredRole) {
        return errorResponse(
          res,
          validationMessages.UNAUTHORIZED,
          httpCodes.BAD_REQUEST,
          null
        );
      }
      
      next();
    } catch (error) {
      return errorResponse(
        res,
        error.message,
        httpCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
  };
};