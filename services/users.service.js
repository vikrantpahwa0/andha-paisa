import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../database/index";
import {
  successMessages,
  failureMessages,
  validationMessages,
} from "../constants/messages";
import { codes } from "../constants/codes";

const { USERS, VERIFICATIONS } = db;

export const registerUser = async (data) => {
  const { name, user_name, password } = data;
  const normalizedUsername = user_name.toLowerCase();

  const existingUser = await USERS.findOne({
    where: { user_name: normalizedUsername },
  });

  if (existingUser) {
    throw new Error(failureMessages.USER_ALREADY_EXISTS);
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await USERS.create({
    name,
    user_name: normalizedUsername,
    password: password_hash,
  });

  return {
    message: successMessages.USER_REGISTERED,
    userId: user.id,
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

  const otp = crypto.randomInt(100000, 999999).toString();
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
      console.log(
        `[EMAIL OTP] Sending OTP ${otp} to email: ${normalizedEmail}`,
      );
      break;

    case !!mobile:
      console.log(
        `[SMS OTP] Sending OTP ${otp} to mobile: ${country_code} ${mobile}`,
      );
      break;

    default:
      throw new Error(failureMessages.INVALID_METHOD);
  }
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

  // Normalize email to lowercase if it exists
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

  if (normalizedEmail) {
    const existingUser = await USERS.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        code: codes.PG_DSH,
      };
    }
  } else if (mobile) {
    const existingUser = await USERS.findOne({
      where: {
        mobile_number: mobile,
        country_code: country_code,
      },
    });

    if (existingUser) {
      return {
        code: codes.PG_DSH,
      };
    }
  }

  return {
    verificationId: verification.id,
  };
};

export const loginUser = async (data) => {
  const { user_name, password } = data;
  const normalizedUsername = user_name.toLowerCase();

  const user = await USERS.findOne({
    where: { user_name: normalizedUsername },
  });

  if (!user) {
    throw new Error(failureMessages.INVALID_CREDENTIALS);
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    throw new Error(failureMessages.INVALID_CREDENTIALS);
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};
