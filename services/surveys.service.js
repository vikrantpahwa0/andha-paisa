import db from "../database/index.js";
import {
  successMessages,
  failureMessages,
  validationMessages,
} from "../constants/messages.js";

const { SURVEY, SURVEY_QUESTIONS, SURVEYS_QUESTIONS_OPTIONS } = db;

/**
 * Create or update survey basic info
 */
/**
 * Create or update survey basic info
 */
const createUpdateSurveyBasicInfo = async (surveyBasicInfo) => {
  const { id, name, reward, is_active } = surveyBasicInfo;

  if (id) {
    // Update existing survey
    const survey = await SURVEY.findByPk(id);
    if (!survey) {
      throw new Error(failureMessages.SURVEY_NOT_FOUND);
    }
    await survey.update(surveyBasicInfo);
    return survey;
  } else {
    // Create new survey
    const survey = await SURVEY.create(surveyBasicInfo);
    return survey;
  }
};

/**
 * Create or update questions with their options
 */
const createUpdateQuestions = async (surveyId, questions) => {
  for (const questionData of questions) {
    if (questionData.is_active === false) {
      // DELETE (soft delete) the question and its options
      if (questionData.id) {
        // Soft delete the question
        await SURVEY_QUESTIONS.update(
          { is_active: false },
          { where: { id: questionData.id, survey_id: surveyId } },
        );
        // Soft delete its options
        await SURVEYS_QUESTIONS_OPTIONS.update(
          { is_active: false },
          { where: { question_id: questionData.id } },
        );
      }
      continue; // Skip to next question
    }

    // For active questions, create or update
    let question;

    if (questionData.id) {
      // Update existing question
      await SURVEY_QUESTIONS.update(
        {
          question_text: questionData.question_text,
          question_type: questionData.question_type,
          is_active: true,
        },
        { where: { id: questionData.id, survey_id: surveyId } },
      );
      question = await SURVEY_QUESTIONS.findByPk(questionData.id);
    } else {
      // Create new question
      question = await SURVEY_QUESTIONS.create({
        question_text: questionData.question_text,
        question_type: questionData.question_type,
        survey_id: surveyId,
        is_active: true,
      });
    }

    // Handle options for "with_options" question type
    if (questionData.question_type === "with_options" && questionData.options) {
      for (const optionData of questionData.options) {
        if (optionData.is_active === false) {
          // DELETE the option
          if (optionData.id) {
            await SURVEYS_QUESTIONS_OPTIONS.update(
              { is_active: false },
              { where: { id: optionData.id, question_id: question.id } },
            );
          }
          continue;
        }

        // For active options, create or update
        if (optionData.id) {
          // Update existing option
          await SURVEYS_QUESTIONS_OPTIONS.update(
            {
              option_text: optionData.option_text,
              is_active: true,
            },
            { where: { id: optionData.id, question_id: question.id } },
          );
        } else {
          // Create new option
          await SURVEYS_QUESTIONS_OPTIONS.create({
            question_id: question.id,
            option_text: optionData.option_text,
            is_active: true,
          });
        }
      }
    }
  }
};

/**
 * Main function to create or update surveys
 */
export const createUpdateSurveys = async (data) => {
  const { surveyBasicInfo, questions } = data;

  // Validate
  if (surveyBasicInfo.is_active) {
    if (!surveyBasicInfo.name || !surveyBasicInfo.reward) {
      throw new Error("Name and reward are required");
    }

    if (!questions || questions.length === 0) {
      throw new Error("At least one question is required");
    }
  }

  // Create or update survey basic info (id will be inside surveyBasicInfo if updating)
  const survey = await createUpdateSurveyBasicInfo(surveyBasicInfo);

  // Create or update questions
  await createUpdateQuestions(survey.id, questions);

  return {
    surveyId: survey.id,
  };
};

export const listSurveys = async (data) => {
  return await SURVEY.findAll({
    where: { is_active: true },
    include: [
      {
        model: SURVEY_QUESTIONS,
        as: "questions",
        where: { is_active: true },
        required: false,
        include: [
          {
            model: SURVEYS_QUESTIONS_OPTIONS,
            as: "options",
            where: { is_active: true },
            required: false,
          },
        ],
      },
    ],
    order: [
      ["created_at", "DESC"], // Latest surveys first
      [{ model: SURVEY_QUESTIONS, as: "questions" }, "created_at", "ASC"],
    ],
  });
};
