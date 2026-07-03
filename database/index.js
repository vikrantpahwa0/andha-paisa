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
import passwordResetTokensModel from "./models/password-reset-tokens.js";
import WithdrawalRequests from "./models/withdrawals/withdrawal_requests.js"

// Import spin models
import SpinPrizeModel from "./models/spin-the-wheel/spin-prize.js";
import SpinTransactionModel from "./models/spin-the-wheel/spin-transaction.js";

// Initialize all models
const Survey = SurveyModel(sequelize);
const SurveyQuestions = SurveysQuestions(sequelize);
const SurveyQuestionOptions = SurveysQuestionsOptions(sequelize);
const Users = UsersModel(sequelize);
const PasswordResetTokens = passwordResetTokensModel(sequelize);
const Verifications = VerificationsModel(sequelize);
const RefreshTokens = refreshTokensModel(sequelize);
const UsersSurveysTransactions = usersSurveysTransactions(sequelize);
const UsersSurveyAnswers = usersSurveyAnswers(sequelize);
const UserBankDetail = UserBankDetailModel(sequelize);
const Config = configsModel(sequelize);
const withdrwalRequests = WithdrawalRequests(sequelize)

// Initialize spin models
const SpinPrize = SpinPrizeModel(sequelize);
const SpinTransaction = SpinTransactionModel(sequelize);

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
  UserBankDetail,
  Config,
  SpinPrize,
  SpinTransaction,
  PasswordResetTokens,
  withdrwalRequests
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
  CONFIG: Config,
  SPIN_PRIZE: SpinPrize,
  SPIN_TRANSACTION: SpinTransaction,
  PASSWORD_RESET_TOKEN: PasswordResetTokens,
  WITHDRAWAL_REQUESTS: withdrwalRequests
};

export default db;
