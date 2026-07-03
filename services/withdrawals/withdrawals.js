import db from "../../database/index.js";
import {
  successMessages,
  failureMessages,
  validationMessages,
} from "../../constants/messages.js";
import { codes } from "../../constants/codes.js";
const { sequelize } = db;
const { WITHDRAWAL_REQUESTS } = db;
import { Op } from "sequelize";

export const createUpdateWithdrawal = async (body, userId) => {

    return await WITHDRAWAL_REQUESTS.create({amount: body.amount,user_id:userId});

};

export const listWithdrawalRequests = async (userId) => {

    return await WITHDRAWAL_REQUESTS.findAll({where: { user_id:userId }});

};
