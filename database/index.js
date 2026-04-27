import sequelize from "./db.config.js";
import SurveyModel from "./models/surveys/surveys.js";
import SurveysQuestions from "./models/surveys/surveys-questions.js";
import UsersModel from "./models/users.js";
import VerificationsModel from "./models/verifications.js";
import SurveysQuestionsOptions from "./models/surveys/surveys-questions-options.js";

const Survey = SurveyModel(sequelize);
const Users = UsersModel(sequelize);
const Verifications = VerificationsModel(sequelize);
const SurveyQuestions = SurveysQuestions(sequelize);
const SurveyQuestionOptions = SurveysQuestionsOptions(sequelize);

const db = {};

db.sequelize = sequelize;
db.SURVEY = Survey;
db.USERS = Users;
db.VERIFICATIONS = Verifications;
db.SURVEY_QUESTIONS = SurveyQuestions;
db.SURVEYS_QUESTIONS_OPTIONS = SurveyQuestionOptions;

export default db;
