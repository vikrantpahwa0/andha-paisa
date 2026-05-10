import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SpinPrize = sequelize.define(
    "SpinPrize",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      probability: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        defaultValue: "#94a3b8",
      },
      segment_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: "spin_prizes",
      timestamps: false,
    },
  );

  return SpinPrize;
};
