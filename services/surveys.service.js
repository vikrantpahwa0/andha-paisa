import db from "../database/index.js";
import {
  successMessages,
  failureMessages,
  validationMessages,
} from "../constants/messages.js";

const { SURVEY, SURVEY_QUESTIONS, SURVEYS_QUESTIONS_OPTIONS, USER_SURVEY_TRANSACTIONS, USER_SURVEY_ANSWERS } = db;

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
      throw new Error(validationMessages.SURVEY_MESSAGES.NAME_REWARD_REQUIRED);
    }

    if (!questions || questions.length === 0) {
      throw new Error(validationMessages.SURVEY_MESSAGES.QUESTIONS_REQUIRED);
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

const processSurveysForUser = async (surveys, userId) => {
  const lastCompletedSurvey = await USER_SURVEY_TRANSACTIONS.findOne({
    where: {
      user_id: userId,
      status: ["ATTEMPTED", "COMPLETED"]
    },
    order: [["survey_id", "DESC"]],
    attributes: ["survey_id"]
  });

  // Convert to plain objects
  const processedSurveys = [];

  let nextSurveyFound = false;
  
  for (let i = 0; i < surveys.length; i++) {
    const survey = surveys[i];
    const surveyObj = survey.toJSON(); // Convert Sequelize instance to plain object
    
    // Remove questions key
    delete surveyObj.questions;
    
    // Add reward points
    surveyObj.rewardPoints = parseInt(survey.reward) * parseInt(process.env.SURVEY_REWARD_POINTS);
    
    // Add status
    if (lastCompletedSurvey && surveyObj.id <= lastCompletedSurvey.survey_id) {
      surveyObj.status = "ALS"; // Already Submitted
    } 
    else if (!nextSurveyFound) {
      // This is the next survey after the last completed one
      surveyObj.status = "STR"; // Start
      nextSurveyFound = true;

      // Create transaction record - use try/catch to handle duplicates
      const existingTransaction = await USER_SURVEY_TRANSACTIONS.findOne({
        where: {
          user_id: userId,
          survey_id: surveyObj.id
        }
      });

      if (!existingTransaction) {
        await USER_SURVEY_TRANSACTIONS.create({
          user_id: userId,
          survey_id: surveyObj.id,
          status: "ASSIGNED"
        });
      }
    }
    else {
      surveyObj.status = "LCK"; // Locked
    }
    
    processedSurveys.push(surveyObj);
  }
  
  return processedSurveys;
};
  
export const listSurveys = async (data) => {
  let allSurveys = await SURVEY.findAll({
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
      ["id", "ASC"],
      [{ model: SURVEY_QUESTIONS, as: "questions" }, "id", "ASC"],
    ],
  });

  if (data?.forUsers) {
    if (data.forUsers && data.userId) {
    allSurveys = await processSurveysForUser(allSurveys, data.userId);
  }
  }

  return allSurveys;
};

/**
 * Get single survey by ID for user
 */
export const getSurveyById = async (data) => {
  const { surveyId, userId } = data;
  
  const transaction = await USER_SURVEY_TRANSACTIONS.findOne({
    where: {
      user_id: userId,
      survey_id: surveyId,
      status: "ASSIGNED"
    }
  });

  if (!transaction) {
    throw new Error(failureMessages.SURVEY_ACCESS_DENIED);
  }

  // Fetch survey with questions and options
  const survey = await SURVEY.findByPk(surveyId, {
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
      [{ model: SURVEY_QUESTIONS, as: "questions" }, "id", "ASC"],
    ],
  });

  if (!survey) {
    throw new Error(failureMessages.SURVEY_NOT_FOUND);
  }

  return survey;
};

export const  submitUserSurvey = async (data) => {
  const { userId, surveyId, answers } = data;

  if (!userId || !surveyId || !answers || !Array.isArray(answers)) {
    throw new Error(validationMessages.SURVEY_MODULE_MESSAGES.INVALID_SUBMISSION_DATA);
  }

  // Start a database transaction
  const transaction = await db.sequelize.transaction();

  try {
    // 1. Verify the survey is assigned to this user with status "ASSIGNED"
    const userTransaction = await USER_SURVEY_TRANSACTIONS.findOne({
      where: {
        user_id: userId,
        survey_id: surveyId,
        status: "ASSIGNED",
      },
      transaction,
    });

    if (!userTransaction) {
      throw new Error(failureMessages.SURVEY_ACCESS_DENIED);
    }

    // 2. Fetch the survey with its questions and options (to validate answers)
    const survey = await SURVEY.findByPk(surveyId, {
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
      transaction,
    });

    if (!survey) {
      throw new Error(failureMessages.SURVEY_NOT_FOUND);
    }

    // Build a map of question_id -> question object for quick lookup
    const questionMap = new Map();
    survey.questions.forEach((question) => {
      questionMap.set(question.id, question);
    });

    // 3. Validate and prepare answer records
    const answerRecords = [];

    for (const ans of answers) {
      const { questionId, optionChosenId, textAnswer } = ans;

      if (!questionId) {
        throw new Error(validationMessages.SURVEY_MODULE_MESSAGES.QUESTION_ID_REQUIRED);
      }

      const question = questionMap.get(questionId);
      if (!question) {
        throw new Error(
          `${validationMessages.SURVEY_MODULE_MESSAGES.QUESTION_NOT_FOUND}: ${questionId}`
        );
      }

      // For "with_options" type, we need a valid option
      if (question.question_type === "with_options") {
        if (!optionChosenId) {
          throw new Error(
            `${validationMessages.SURVEY_MODULE_MESSAGES.OPTION_REQUIRED} for question ${questionId}`
          );
        }
        // Verify the option belongs to this question and is active
        const validOption = question.options.some(
          (opt) => opt.id === optionChosenId
        );
        if (!validOption) {
          throw new Error(
            `${validationMessages.SURVEY_MODULE_MESSAGES.OPTION_NOT_FOUND}: ${optionChosenId}`
          );
        }
      } else {
        // For other question types (text, numeric, etc.), textAnswer is required
        if (!textAnswer || textAnswer.trim() === "") {
          throw new Error(
            `${validationMessages.SURVEY_MODULE_MESSAGES.TEXT_ANSWER_REQUIRED} for question ${questionId}`
          );
        }
      }

      answerRecords.push({
        user_transaction_id: userTransaction.id,
        question_id: questionId,
        option_chosen_id: optionChosenId || null,
        text_answer: textAnswer || null,
      });
    }

    // Optional: check that all questions in the survey have been answered
    // (only if the survey requires complete answers)
    const allQuestionIds = survey.questions.map((q) => q.id);
    const answeredQuestionIds = answerRecords.map((rec) => rec.question_id);
    const missingQuestions = allQuestionIds.filter(
      (id) => !answeredQuestionIds.includes(id)
    );
    if (missingQuestions.length > 0) {
      throw new Error(
        `${validationMessages.SURVEY_MODULE_MESSAGES.MISSING_ANSWERS}: ${missingQuestions.join(
          ", "
        )}`
      );
    }

    // 4. Insert answers
    await USER_SURVEY_ANSWERS.bulkCreate(answerRecords, { transaction });

    // 5. Update transaction status to "ATTEMPTED"
    await userTransaction.update({ status: "ATTEMPTED" }, { transaction });

    // Commit transaction
    await transaction.commit();

  } catch (error) {
    // Rollback transaction on any error
    await transaction.rollback();
    throw error;
  }
};