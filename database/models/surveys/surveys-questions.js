// models/SurveysQuestion.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SurveysQuestion = sequelize.define(
    "SurveysQuestion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      question_type: {
        type: DataTypes.ENUM("email", "mobile", "with_options", "input"),
        allowNull: false,
      },
      survey_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "surveys",
          key: "id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    {
      tableName: "surveys_questions",
      timestamps: false,
    },
  );

  SurveysQuestion.associate = (models) => {
    SurveysQuestion.belongsTo(models.Survey, {
      foreignKey: "survey_id",
      as: "survey",
    });
    SurveysQuestion.hasMany(models.SurveysQuestionOption, {
      foreignKey: "question_id",
      as: "options",
    });
    SurveysQuestion.hasMany(models.UsersSurveysAnswer, {
      foreignKey: "question_id",
      as: "answers",
    });
  };

  return SurveysQuestion;
};
