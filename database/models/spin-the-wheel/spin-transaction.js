import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SpinTransaction = sequelize.define(
    "SpinTransaction",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      prize_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rotation_angle: {
        type: DataTypes.FLOAT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "spin_transactions",
      timestamps: false,
    },
  );

  SpinTransaction.associate = (models) => {
    SpinTransaction.belongsTo(models.SpinPrize, {
      foreignKey: "prize_id",
      as: "prize",
    });
  };

  return SpinTransaction;
};
