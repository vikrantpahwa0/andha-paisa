// services/configService.js
import db from "../database/index.js";
import { failureMessages, validationMessages } from "../constants/messages.js";

const { CONFIG } = db;

export const getConfigValue = async (code) => {
  try {
    const config = await CONFIG.findOne({
      where: { code },
      attributes: ["value"],
    });
    if (!config) {
      throw new Error(`${failureMessages.CONFIG_MESSAGES.NOT_FOUND}: ${code}`);
    }
    return config.value;
  } catch (error) {
    console.error("Error fetching config:", error.message);
    throw error;
  }
};

export const getMultipleConfigs = async (codes) => {
  if (!codes || !Array.isArray(codes) || codes.length === 0) {
    throw new Error(validationMessages.CONFIG_MESSAGES.CODES_ARRAY_REQUIRED);
  }

  try {
    const configs = await CONFIG.findAll({
      where: { code: codes },
      attributes: ["code", "value"],
    });

    const result = {};
    for (const code of codes) {
      const found = configs.find(c => c.code === code);
      if (!found) {
        throw new Error(`${failureMessages.CONFIG_MESSAGES.NOT_FOUND}: ${code}`);
      }
      result[code] = found.value;
    }
    return result;
  } catch (error) {
    console.error("Error fetching multiple configs:", error.message);
    throw error;
  }
};