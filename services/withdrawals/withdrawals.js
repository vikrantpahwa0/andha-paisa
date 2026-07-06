import db from "../../database/index.js";
import {
  successMessages,
  failureMessages,
  validationMessages,
} from "../../constants/messages.js";
import { codes } from "../../constants/codes.js";
const { sequelize } = db;
const { WITHDRAWAL_REQUESTS, USERS } = db;
import { Op } from "sequelize";

export const createUpdateWithdrawal = async (body, userId) => {

    return await WITHDRAWAL_REQUESTS.create({amount: body.amount,user_id:userId});

};

export const listWithdrawalRequests = async (userId) => {

    return await WITHDRAWAL_REQUESTS.findAll({where: { user_id:userId }});

};

export const listAllWithdrawalRequests = async () => {

    return await WITHDRAWAL_REQUESTS.findAll({
    include: [
      {
        model: USERS,
        as: "user",
        attributes: ["name"],
      }
    ],
  });

};

export const updateWithdrawalStatus = async (body) => {
  const { id, status } = body;
  
  if (!id) {
    throw new Error(validationMessages.WITHDRAWAL_ID_REQUIRED);
  }

  return await WITHDRAWAL_REQUESTS.update(
    { status: status },
    { 
      where: { id },
      returning: true,
    }
  );
};
