// models/UsersSurveysTransaction.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UsersSurveysTransaction = sequelize.define(
    "UsersSurveysTransaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      survey_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "surveys",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("ASSIGNED", "ATTEMPTED", "COMPLETED"),
        allowNull: false,
        defaultValue: "ASSIGNED",
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
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
      tableName: "users_surveys_transactions",
      timestamps: false,
      hooks: {
        beforeUpdate: async (transaction) => {
          if (transaction.status === "COMPLETED" && !transaction.completed_at) {
            transaction.completed_at = new Date();
          }
        },
      },
    },
  );

  UsersSurveysTransaction.associate = (models) => {
    UsersSurveysTransaction.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    UsersSurveysTransaction.belongsTo(models.Survey, {
      foreignKey: "survey_id",
      as: "survey",
    });
    UsersSurveysTransaction.hasMany(models.UsersSurveysAnswer, {
      foreignKey: "user_transaction_id",
      as: "answers",
    });
  };

  return UsersSurveysTransaction;
};
