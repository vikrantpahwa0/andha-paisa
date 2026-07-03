import { DataTypes } from "sequelize";

export default (sequelize) => {
  const WithdrawalRequests = sequelize.define(
    "WithdrawalRequests",
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },

      status: {
        type: DataTypes.ENUM("PENDING", "CONFIRMED", "REJECTED"),
        defaultValue: "PENDING",
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
      tableName: "withdrawal_requests",
      timestamps: false,
    },
  );

  WithdrawalRequests.associate = (models) => {
    WithdrawalRequests.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return WithdrawalRequests;
};