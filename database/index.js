import sequelize from "./db.config.js";
import SurveyModel from "./models/surveys/surveys.js";
import SurveysQuestions from "./models/surveys/surveys-questions.js";
import SurveysQuestionsOptions from "./models/surveys/surveys-questions-options.js";
import UsersModel from "./models/users.js";
import VerificationsModel from "./models/verifications.js";

// Initialize all models
const Survey = SurveyModel(sequelize);
const SurveyQuestions = SurveysQuestions(sequelize);
const SurveyQuestionOptions = SurveysQuestionsOptions(sequelize);
const Users = UsersModel(sequelize);
const Verifications = VerificationsModel(sequelize);

// Create models object for associations
const models = {
  Survey,
  SurveysQuestion: SurveyQuestions,
  SurveysQuestionOption: SurveyQuestionOptions,
  Users,
  Verifications,
};

// Call associate functions
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

const db = {
  sequelize,
  SURVEY: Survey,
  SURVEY_QUESTIONS: SurveyQuestions,
  SURVEYS_QUESTIONS_OPTIONS: SurveyQuestionOptions,
  USERS: Users,
  VERIFICATIONS: Verifications,
};

export default db;
