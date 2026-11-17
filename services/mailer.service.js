import nodemailer from "nodemailer";
import { failureMessages } from "../constants/messages.js";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(failureMessages.SMTP_NOT_CONFIGURED);
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE) === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
};

export const sendMail = async ({
  to,
  subject,
  html,
  text,
  attachments = [],
}) => {
  const tx = getTransporter();

  const info = await tx.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || "YourApp"}" <${process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
    attachments,
  });

  console.log("✅ Email sent:", info.messageId, "→", to);
  return info;
};
