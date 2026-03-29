import sequelize from "./db.config.js";
import SurveyModel from "./models/surveys.js";
import UsersModel from "./models/users.js";
import VerificationsModel from "./models/verifications.js";

const Survey = SurveyModel(sequelize);
const Users = UsersModel(sequelize);
const Verifications = VerificationsModel(sequelize);


const db = {};

db.sequelize = sequelize;
db.SURVEY = Survey;
db.USERS = Users;
db.VERIFICATIONS = Verifications;

export default db;
