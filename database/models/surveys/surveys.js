import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Survey = sequelize.define(
    "Survey",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true, // Changed to true temporarily
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reward: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    },
    {
      tableName: "surveys",
      timestamps: false,
      hooks: {
        beforeCreate: async (survey) => {
          // Generate a temporary code or leave it null
          // We'll generate the real code in afterCreate
        },
        afterCreate: async (survey) => {
          // Generate code after ID is available
          const namePrefix = survey.name.substring(0, 3).toUpperCase();
          const now = new Date();
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
          const timeStr = now.toISOString().slice(11, 19).replace(/:/g, "");
          const code = `${namePrefix}_${survey.id}_${dateStr}_${timeStr}`;

          await survey.update({ code });
        },
      },
    },
  );

  Survey.associate = (models) => {
    Survey.hasMany(models.SurveysQuestion, {
      foreignKey: "survey_id",
      as: "questions",
    });
    Survey.hasMany(models.UsersSurveysTransaction, {
      foreignKey: "survey_id",
      as: "userTransactions",
    });
  };

  return Survey;
};
