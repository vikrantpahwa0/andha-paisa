import db from "../database/index.js";
import {
  successMessages,
  failureMessages,
  validationMessages,
} from "../constants/messages.js";
import { codes } from "../constants/codes.js";
const { sequelize } = db;
const {
  USER_SURVEY_TRANSACTIONS,
  USERS,
  SURVEY
} = db;
import { Op } from 'sequelize';

export const fetchWithdrawableTransactions = async () => {
    return await await USER_SURVEY_TRANSACTIONS.findAll({
  where: {
    status: "ATTEMPTED"
  },
  attributes: ["id", "completed_at"],
  include: [
    {
      model: USERS,
      as: "user",
      attributes: ["name"]
    },
    {
      model: SURVEY,
      as: "transactionSurvey",
      attributes: ["name", "reward"]
    }
  ]
});
};