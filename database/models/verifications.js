import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Verification = sequelize.define(
    "Verification",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      country_code: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },

      mobile: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },

      verification_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      expires_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      registration_used: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
}
    },
    {
      tableName: "verifications",
      timestamps: false,
    },
  );

  return Verification;
};
