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

const { USERS, VERIFICATIONS, REFRESH_TOKENS } = db; // Add REFRESH_TOKENS model

// Helper function to generate tokens
const generateTokens = async (userId, role) => {
  // Generate access token (short-lived)
  const accessToken = jwt.sign(
    { userId, role }, 
    process.env.JWT_ACCESS_SECRET, // Use different secret
    { expiresIn: "15d" } // 15 minutes
  );
  
  // Generate refresh token (long-lived)
  const refreshToken = jwt.sign(
    { userId, role }, 
    process.env.JWT_REFRESH_SECRET, // Different secret
    { expiresIn: "7d" } // 7 days
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
    throw new Error("No refresh token provided");
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
      throw new Error("Invalid refresh token");
    }
    
    // Check if token is expired
    if (new Date() > new Date(storedToken.expires_at)) {
      await storedToken.update({ is_active: false });
      throw new Error("Refresh token expired");
    }
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15d" }
    );
    
    // Optional: Rotate refresh token (issue new one)
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    
    // Deactivate old refresh token
    await storedToken.update({ is_active: false });
    
    // Store new refresh token
    await REFRESH_TOKENS.create({
      user_id: decoded.userId,
      token: newRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      is_active: true
    });
    
    return { 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    };
    
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
  const { name, email, mobile_number, country_code, password } = data;

  const password_hash = password && (await bcrypt.hash(password, 10));

  const user = await USERS.create({
    name,
    password: password_hash || null,
    email: email || null,
    mobile_number: mobile_number || null,
    country_code: country_code || null,
  });

  // Generate both tokens
  const { accessToken, refreshToken } = await generateTokens(user.id, user.role);

  return {
    message: successMessages.USER_REGISTERED,
    userId: user.id,
    accessToken,
    refreshToken
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

export const fetchUser = async (userId) => {
  const user = await USERS.findOne({
    where: { id: userId },
    attributes: ["id", "name", "email"],
  });
  if (!user) {
    throw new Error(failureMessages.USER_NOT_FOUND);
  }
  return user;
};