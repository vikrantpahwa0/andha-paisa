import fs from "fs";
import path from "path";
import db from "../database/index.js";
import { failureMessages, validationMessages } from "../constants/messages.js";
import { POSITIONS } from "../database/constants/positions.js";
import { extractVariables } from "./render.service.js";

const { TEMPLATES, APPLICATIONS } = db;
const { Op } = db.Sequelize || {};

const unlinkQuietly = (filePath) => {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.warn("Could not delete resume file:", filePath, e.message);
  }
};

const assertPosition = (position) => {
  if (!POSITIONS.includes(position)) {
    throw new Error(validationMessages.INVALID_POSITION);
  }
};

export const createTemplate = async (data, file) => {
  const { name, position, recruiterEmail, subject, body } = data;

  if (!name || !position || !recruiterEmail || !subject || !body) {
    throw new Error(validationMessages.REQUIRED_FIELDS);
  }
  assertPosition(position);

  const template = await TEMPLATES.create({
    name,
    position,
    recruiter_email: String(recruiterEmail).toLowerCase().trim(),
    subject,
    body,
    resume_path: file ? file.path : null,
    resume_original_name: file ? file.originalname : null,
    resume_mime: file ? file.mimetype : null,
    resume_size: file ? file.size : null,
  });

  const json = template.toJSON();
  json.variables = extractVariables(template.subject, template.body);
  return json;
};

export const fetchTemplates = async (query = {}) => {
  const { position, search } = query;
  const where = { is_active: true };

  if (position) where.position = position;
  if (search) where.name = { [Op.iLike]: `%${search}%` };

  const templates = await TEMPLATES.findAll({
    where,
    order: [["created_at", "DESC"]],
  });

  return templates.map((t) => {
    const json = t.toJSON();
    json.variables = extractVariables(t.subject, t.body);
    return json;
  });
};

export const fetchTemplateById = async (id) => {
  const template = await TEMPLATES.findByPk(id);
  if (!template) throw new Error(failureMessages.TEMPLATE_NOT_FOUND);

  const json = template.toJSON();
  json.variables = extractVariables(template.subject, template.body);
  return json;
};

export const updateTemplate = async (id, data, file) => {
  const template = await TEMPLATES.findByPk(id);
  if (!template) throw new Error(failureMessages.TEMPLATE_NOT_FOUND);

  const { name, position, recruiterEmail, subject, body } = data;

  if (position) assertPosition(position);

  const payload = {};
  if (name !== undefined) payload.name = name;
  if (position !== undefined) payload.position = position;
  if (recruiterEmail !== undefined)
    payload.recruiter_email = String(recruiterEmail).toLowerCase().trim();
  if (subject !== undefined) payload.subject = subject;
  if (body !== undefined) payload.body = body;

  if (file) {
    unlinkQuietly(template.resume_path);
    payload.resume_path = file.path;
    payload.resume_original_name = file.originalname;
    payload.resume_mime = file.mimetype;
    payload.resume_size = file.size;
  }

  await template.update(payload);

  const json = template.toJSON();
  json.variables = extractVariables(template.subject, template.body);
  return json;
};

export const deleteTemplate = async (id) => {
  const template = await TEMPLATES.findByPk(id);
  if (!template) throw new Error(failureMessages.TEMPLATE_NOT_FOUND);

  const inUse = await APPLICATIONS.count({ where: { template_id: id } });
  if (inUse > 0) throw new Error(failureMessages.TEMPLATE_IN_USE);

  unlinkQuietly(template.resume_path);
  await template.destroy();
  return true;
};
