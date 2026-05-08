import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../database/index.js";
import {
  successMessages,
  failureMessages,
  validationMessages,
} from "../constants/messages.js";
import { codes } from "../constants/codes.js";
import { sendOTPEmail } from "./send-email.js";
import { saveBase64Image } from '../utils/saveBase64Image.js';
import { getMultipleConfigs } from "../utils/commonFunctions.js";
const { sequelize } = db;
const { USERS, VERIFICATIONS, REFRESH_TOKENS, USER_BANK_DETAIL, USER_SURVEY_TRANSACTIONS } = db; // Add REFRESH_TOKENS model

// Helper function to generate tokens
const generateTokens = async (userId, role) => {
  // Generate access token (short-lived)
  const accessToken = jwt.sign(
    { userId, role }, 
    process.env.JWT_ACCESS_SECRET, // Use different secret
    { expiresIn: process.env.ACCESSTOKEN_EXPIRY } // 15 seconds
  );
  
  // Generate refresh token (long-lived)
  const refreshToken = jwt.sign(
    { userId, role }, 
    process.env.JWT_REFRESH_SECRET, // Different secret
    { expiresIn: process.env.REFRESSHTOKEN_EXPIRY } // 7 days
  );
  
  // Store refresh token in database (optional but recommended)
  await REFRESH_TOKENS.create({
    user_id: userId,
    token: refreshToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    is_active: true
  });
  
  return { accessToken, refreshToken };
};

// Generate new access token from refresh token
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error(validationMessages.TOKEN_REQUIRED);
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Check if token exists in database and is active
    const storedToken = await REFRESH_TOKENS.findOne({
      where: { 
        token: refreshToken, 
        is_active: true,
        user_id: decoded.userId
      }
    });
    
    if (!storedToken) {
      throw new Error(failureMessages.INVALID_TOKEN);
    }
    
    // Check if token is expired
    if (new Date() > new Date(storedToken.expires_at)) {
      await storedToken.update({ is_active: false });
      throw new Error(failureMessages.TOKEN_EXPIRED);
    }
    
    // Deactivate the old refresh token (prevent replay)
    await storedToken.update({ is_active: false });
    
    // Reuse the first function to generate new tokens and store the new refresh token
    return await generateTokens(decoded.userId, decoded.role);
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error("Refresh token expired");
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error("Invalid refresh token");
    }
    throw error;
  }
};

// Updated registerUser
export const registerUser = async (data) => {
  const { name, email, mobile_number, country_code, password, verificationId } = data;

  // 1. Validate the verification record
  const verification = await VERIFICATIONS.findByPk(verificationId);
  if (!verification) {
    throw new Error(failureMessages.NO_ACTIVE_VERIFICATION);
  }

  // 2. Check that it's verified, not already used, and not expired
  if (!verification.is_verified || verification.registration_used) {
    throw new Error(failureMessages.VERIFICATION_SESSION_USED);
  }
  if (verification.expires_at < new Date()) {
    throw new Error(failureMessages.VERIFICATION_EXPIRED);
  }

  // 4. Create the user (use data from verification record for email/mobile)
  const password_hash = password && (await bcrypt.hash(password, 10));
  const user = await USERS.create({
    name,
    password: password_hash || null,
    email: email || null,
    mobile_number: mobile_number || null,
    country_code: country_code || null,
  });

  // 5. Mark verification as used
  await verification.update({ registration_used: true });

  // 6. Generate tokens
  const { accessToken, refreshToken } = await generateTokens(user.id, user.role);

  return {
    message: successMessages.USER_REGISTERED,
    userId: user.id,
    accessToken,
    refreshToken,
  };
};

export const sendOtp = async (data) => {
  const { email, mobile, country_code } = data;

  if (!email && !mobile) {
    throw new Error(validationMessages.EMAIL_MOBILE_REQUIRED);
  }

  if (mobile && !country_code) {
    throw new Error(validationMessages.COUNTRY_CODE_REQUIRED);
  }

  const normalizedEmail = email ? email.toLowerCase() : null;

  if (normalizedEmail) {
    const existingUser = await USERS.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        code: codes.PG_PASS,
      };
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  if (normalizedEmail) {
    await VERIFICATIONS.update(
      { is_active: false },
      {
        where: {
          email: normalizedEmail,
          is_active: true,
          is_verified: false,
        },
      },
    );
  } else if (mobile) {
    await VERIFICATIONS.update(
      { is_active: false },
      {
        where: {
          mobile,
          country_code,
          is_active: true,
          is_verified: false,
        },
      },
    );
  }

  const verification = await VERIFICATIONS.create({
    country_code: country_code || null,
    mobile: mobile || null,
    email: normalizedEmail,
    verification_code: otp,
    is_active: true,
    is_verified: false,
    created_at: new Date(),
    expires_at: expiresAt,
  });

  // Send OTP based on contact method
  switch (true) {
    case !!normalizedEmail:
      await sendOTPEmail(normalizedEmail, otp, expiresAt)
      break;

    case !!mobile:
      console.log(
        `[SMS OTP] Sending OTP ${otp} to mobile: ${country_code} ${mobile}`,
      );
      break;

    default:
      throw new Error(failureMessages.INVALID_METHOD);
  }

  return {
    code: codes.PG_VERF,
  };
};

export const verifyOtp = async (data) => {
  const { email, mobile, country_code, otp } = data;

  if (!email && !mobile) {
    throw new Error(validationMessages.EMAIL_MOBILE_REQUIRED);
  }

  if (mobile && !country_code) {
    throw new Error(validationMessages.COUNTRY_CODE_REQUIRED);
  }

  if (!otp) {
    throw new Error(validationMessages.OTP_REQUIRED);
  }

  const normalizedEmail = email ? email.toLowerCase() : null;

  const whereCondition = normalizedEmail
    ? { email: normalizedEmail, is_active: true, is_verified: false }
    : { mobile, country_code, is_active: true, is_verified: false };

  const verification = await VERIFICATIONS.findOne({
    where: whereCondition,
    order: [["created_at", "DESC"]],
  });

  if (!verification) {
    throw new Error(failureMessages.NO_ACTIVE_VERIFICATION);
  }

  if (new Date() > new Date(verification.expires_at)) {
    await verification.update({ is_active: false });
    throw new Error(failureMessages.OTP_EXPIRED);
  }

  if (verification.verification_code !== otp) {
    throw new Error(failureMessages.INVALID_OTP);
  }

  await verification.update({
    is_verified: true,
    is_active: false,
  });

  let existingUser;

  if (normalizedEmail) {
    existingUser = await USERS.findOne({
      where: { email: normalizedEmail },
    });
  } else if (mobile) {
    existingUser = await USERS.findOne({
      where: {
        mobile_number: mobile,
        country_code: country_code,
      },
    });
  }
  
  if (existingUser) {
    // Generate both tokens for existing user
    const { accessToken, refreshToken } = await generateTokens(existingUser.id, existingUser.role);
    
    return {
      code: codes.PG_DSH,
      accessToken,
      refreshToken,
    };
  } else {
    return {
      code: codes.PG_ONB,
      verificationId: verification.id, 
    };
  }
};

// Updated loginUser
export const loginUser = async (data) => {
  const { email, password } = data;
  const normalizedEmail = email.toLowerCase();

  const user = await USERS.findOne({
    where: { email: normalizedEmail },
    attributes: ["id", "role", "password"],
  });

  if (!user) {
    throw new Error(failureMessages.INVALID_CREDENTIALS);
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error(failureMessages.INVALID_CREDENTIALS);
  }

  // Generate both tokens
  const { accessToken, refreshToken } = await generateTokens(user.id, user.role);

  return {
    code: user.role === "AD" ? codes.PG_ADM : codes.PG_DSH,
    accessToken,
    refreshToken,
  };
};

export const fetchUser = async (userId, fetchBankDetails = false) => {
  const include = fetchBankDetails
    ? [
        {
          model: USER_BANK_DETAIL,
          as: "bankDetail", // matches the alias defined in association
          attributes: ["account_holder_name", "bank_name", "account_number", "ifsc_code"],
        },
      ]
    : [];

  const user = await USERS.findOne({
    where: { id: userId },
    attributes: ["id", "name", "email", "profilePicture"],
    include,
  });

  if (!user) {
    throw new Error(failureMessages.USER_NOT_FOUND);
  }

  return user;
};

export const updateUser = async (data) => {
  const { userId, userDetails, bankDetails } = data;

  if (userDetails) {
    // If profilePicture is a base64 string, save to file and replace with URL
    if (userDetails.profilePicture && userDetails.profilePicture.startsWith('data:image')) {
      try {
        const imageUrl = saveBase64Image(userDetails.profilePicture, userId);
        userDetails.profilePicture = imageUrl; // Replace base64 with URL
      } catch (error) {
        console.error('Failed to save profile picture:', error);
        // Optionally keep the original base64 or throw
        throw new Error('Invalid image data');
      }
    }

    await USERS.update(userDetails, {
      where: { id: userId },
    });
  }

  if (bankDetails) {
    const existingBankDetail = await USER_BANK_DETAIL.findOne({
      where: { user_id: userId },
    });
    if (existingBankDetail) {
      await USER_BANK_DETAIL.update(bankDetails, {
        where: { user_id: userId },
      });
    } else {
      await USER_BANK_DETAIL.create({ user_id: userId, ...bankDetails });
    }
  }
};

export const fetchEarnings = async (userId, fetchBankDetails = false) => {

  const result = await sequelize.query("SELECT UST.status, SUM(CAST(S.reward AS INTEGER)) AS total_earnings FROM users_surveys_transactions UST LEFT JOIN surveys S ON UST.survey_id = S.id WHERE UST.user_id = :userId GROUP BY UST.status", {
  replacements: { userId },
  type: sequelize.QueryTypes.SELECT,
});

const configVariables = await getMultipleConfigs(['SURVEY_REWARD_POINTS','WITHDRAW_LIMIT']);
  
const attempted = result.find(r => r.status === "ATTEMPTED")?.total_earnings || 0;
    const completed = result.find(r => r.status === "COMPLETED")?.total_earnings || 0;

  return {attempted:Number(attempted) * Number(configVariables.SURVEY_REWARD_POINTS), completed: Number(completed),points : Number(completed) * Number(configVariables.SURVEY_REWARD_POINTS), withdrawLimit: Number(configVariables.WITHDRAW_LIMIT) };

};