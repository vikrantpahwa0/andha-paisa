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
      const token = req.headers.authorization.substring(7);

      console.log(token)
      console.log(process.env.JWT_ACCESS_SECRET)
      
      if (!token) {
        throw new Error(validationMessages.TOKEN_REQUIRED)
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
      } catch (jwtError) {
        // Handle specific JWT errors
        if (jwtError.name === 'TokenExpiredError') {
          throw new Error(validationMessages.TOKEN_REQUIRED)
        }
        if (jwtError.name === 'JsonWebTokenError') {
          throw new Error(validationMessages.INVALID_TOKEN)
        }
        throw new Error(validationMessages.TOKEN_VERIFICATION_FAILED);
      }
      
      if (req.user.role !== requiredRole) {
        throw new Error(validationMessages.UNAUTHORIZED);
      }
      
      next();
    } catch (error) {
      return errorResponse(
        res, 
        error.message, 
        httpCodes.BAD_REQUEST, 
        error
      );
    }
  };
};