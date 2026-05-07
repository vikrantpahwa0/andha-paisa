import sequelize from "./db.config.js";
import SurveyModel from "./models/surveys/surveys.js";
import SurveysQuestions from "./models/surveys/surveys-questions.js";
import SurveysQuestionsOptions from "./models/surveys/surveys-questions-options.js";
import UsersModel from "./models/users.js";
import VerificationsModel from "./models/verifications.js";
import refreshTokensModel from "./models/refresh-token.js";
import usersSurveysTransactions from "./models/surveys/users-surveys-transactions.js";
import usersSurveyAnswers from "./models/surveys/users-surveys-answers.js";
import UserBankDetailModel from "./models/user-bank-details.js"; 
import configsModel from "./models/configs.js";

// Initialize all models
const Survey = SurveyModel(sequelize);
const SurveyQuestions = SurveysQuestions(sequelize);
const SurveyQuestionOptions = SurveysQuestionsOptions(sequelize);
const Users = UsersModel(sequelize);
const Verifications = VerificationsModel(sequelize);
const RefreshTokens = refreshTokensModel(sequelize);
const UsersSurveysTransactions = usersSurveysTransactions(sequelize);
const UsersSurveyAnswers = usersSurveyAnswers(sequelize);
const UserBankDetail = UserBankDetailModel(sequelize);
const Config = configsModel(sequelize);

// Create models object for associations
const models = {
  Survey,
  SurveysQuestion: SurveyQuestions,
  SurveysQuestionOption: SurveyQuestionOptions,
  RefreshTokens,
  Users,
  Verifications,
  UsersSurveyAnswers,
  UsersSurveysTransactions,
  UserBankDetail,   // ✅ ADD THIS
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
  REFRESH_TOKENS: RefreshTokens,
  USER_SURVEY_TRANSACTIONS: UsersSurveysTransactions,
  USER_SURVEY_ANSWERS: UsersSurveyAnswers,
  USER_BANK_DETAIL: UserBankDetail, 
  CONFIG:Config
};

export default db;