import fs from "fs";
import db from "../database/index.js";
import { failureMessages, validationMessages } from "../constants/messages.js";
import {
  renderTemplate,
  buildHtml,
  extractVariables,
} from "./render.service.js";
import { sendMail } from "./mailer.service.js";

const { TEMPLATES, APPLICATIONS } = db;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmails = (input) => {
  const list = Array.isArray(input) ? input : String(input || "").split(",");
  const cleaned = list
    .map((e) =>
      String(e || "")
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean);

  for (const email of cleaned) {
    if (!EMAIL_REGEX.test(email)) {
      throw new Error(`${validationMessages.INVALID_EMAIL}: ${email}`);
    }
  }
  return [...new Set(cleaned)];
};

export const sendApplication = async (data) => {
  const { templateId, toEmails, customSubject, variables = {} } = data;

  if (!templateId) throw new Error(validationMessages.REQUIRED_FIELDS);

  const template = await TEMPLATES.findByPk(templateId);
  if (!template) throw new Error(failureMessages.TEMPLATE_NOT_FOUND);

  const recipients = normalizeEmails(toEmails);
  if (!recipients.length) throw new Error(failureMessages.NO_RECIPIENTS);

  const subjectSource =
    customSubject && String(customSubject).trim()
      ? String(customSubject).trim()
      : template.subject;

  const renderedSubject = renderTemplate(subjectSource, variables);
  const renderedBody = renderTemplate(template.body, variables);

  const attachments = [];
  if (template.resume_path && fs.existsSync(template.resume_path)) {
    attachments.push({
      filename: template.resume_original_name || "resume.pdf",
      path: template.resume_path,
      contentType: template.resume_mime || undefined,
    });
  }

  const errors = [];
  let sentCount = 0;

  for (const to of recipients) {
    try {
      await sendMail({
        to,
        subject: renderedSubject,
        html: buildHtml(renderedBody),
        text: renderedBody,
        attachments,
      });
      sentCount += 1;
    } catch (err) {
      errors.push(`${to}: ${err.message}`);
    }
  }

  const status =
    sentCount === 0 ? "FAILED" : errors.length > 0 ? "PARTIAL" : "SENT";

  const application = await APPLICATIONS.create({
    template_id: template.id,
    to_emails: recipients,
    subject: subjectSource,
    rendered_subject: renderedSubject,
    rendered_body: renderedBody,
    variables,
    status,
    error: errors.length ? errors.join(" | ") : null,
    sent_at: sentCount > 0 ? new Date() : null,
  });

  if (status === "FAILED") {
    throw new Error(errors.join(" | ") || failureMessages.EMAIL_SENDING_FAILED);
  }

  return {
    ...application.toJSON(),
    sentCount,
    failedCount: errors.length,
    variablesUsed: extractVariables(subjectSource, template.body),
  };
};

export const fetchApplications = async (query = {}) => {
  const applications = await APPLICATIONS.findAll({
    order: [["created_at", "DESC"]],
    include: [
      {
        model: TEMPLATES,
        as: "template",
        attributes: ["id", "name", "position", "recruiter_email"],
      },
    ],
  });
  return applications;
};

export const fetchApplicationById = async (id) => {
  const application = await APPLICATIONS.findByPk(id, {
    include: [{ model: TEMPLATES, as: "template" }],
  });
  if (!application) throw new Error(failureMessages.APPLICATION_NOT_FOUND);
  return application;
};

export const toggleFollowUp = async (id) => {
  const application = await APPLICATIONS.findByPk(id);
  if (!application) throw new Error(failureMessages.APPLICATION_NOT_FOUND);

  await application.update({ stop_follow_up: !application.stop_follow_up });
  return application;
};

// Optional helper the cron uses to fetch the template relationship
export const getApplicationWithTemplate = async (id) => {
  return APPLICATIONS.findByPk(id, {
    include: [{ model: TEMPLATES, as: "template" }],
  });
};
