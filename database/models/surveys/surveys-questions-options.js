// models/SurveysQuestionOption.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SurveysQuestionOption = sequelize.define(
    "SurveysQuestionOption",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "surveys_questions",
          key: "id",
        },
      },
      option_text: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: "surveys_questions_options",
      timestamps: false,
    },
  );

  SurveysQuestionOption.associate = (models) => {
    SurveysQuestionOption.belongsTo(models.SurveysQuestion, {
      foreignKey: "question_id",
      as: "question",
    });
    SurveysQuestionOption.hasMany(models.UsersSurveysAnswer, {
      foreignKey: "option_chosen_id",
      as: "answers",
    });
  };

  return SurveysQuestionOption;
};
