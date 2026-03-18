import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Survey = sequelize.define("Survey", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    reward: {
      type: DataTypes.INTEGER,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Survey;
};
