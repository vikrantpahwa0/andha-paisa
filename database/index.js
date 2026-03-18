import sequelize from "./db.config.js";
import SurveyModel from "./models/surveys.js";
import Users from "./models/users.js";
import verifications from "./models/verifications.js";

const Survey = SurveyModel(sequelize);

const db = {};

db.sequelize = sequelize;
db.SURVEY = Survey;
db.USERS = Users;
db.VERIFICATIONS = verifications;

export default db;
