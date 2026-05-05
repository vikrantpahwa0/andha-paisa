import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      country_code: {
        type: DataTypes.STRING(5),
      },

      mobile_number: {
        type: DataTypes.STRING(15),
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
      },

      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "URL to user's profile picture",
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
      role: {
        type: DataTypes.ENUM("US", "AD"),
        defaultValue: "US",
      },
    },
    {
      tableName: "users",
      timestamps: false,
    },
  );

  User.associate = (models) => {
    User.hasOne(models.UserBankDetail, {
      foreignKey: "user_id",
      as: "bankDetail",
    });
  };

  return User;
};