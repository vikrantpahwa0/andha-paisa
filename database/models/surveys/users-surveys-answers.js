// models/UsersSurveysAnswer.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UsersSurveysAnswer = sequelize.define(
    "UsersSurveysAnswer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users_surveys_transactions",
          key: "id",
        },
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "surveys_questions",
          key: "id",
        },
      },
      option_chosen_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "surveys_questions_options",
          key: "id",
        },
      },
      text_answer: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users_surveys_answers",
      timestamps: false,
      updatedAt: false, // Only created_at as per requirements
    },
  );

  UsersSurveysAnswer.associate = (models) => {
    UsersSurveysAnswer.belongsTo(models.UsersSurveysTransaction, {
      foreignKey: "user_transaction_id",
      as: "userTransaction",
    });
    UsersSurveysAnswer.belongsTo(models.SurveysQuestion, {
      foreignKey: "question_id",
      as: "question",
    });
    UsersSurveysAnswer.belongsTo(models.SurveysQuestionOption, {
      foreignKey: "option_chosen_id",
      as: "chosenOption",
    });
  };

  return UsersSurveysAnswer;
};
