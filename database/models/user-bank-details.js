// models/UserBankDetail.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserBankDetail = sequelize.define(
    "UserBankDetail",
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
          model: "users",      // matches your User table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      account_holder_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [9, 18],
          is: /^\d+$/,
        },
      },
      ifsc_code: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
          is: /^[A-Z]{4}0[A-Z0-9]{6}$/i,
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
    },
    {
      tableName: "users_bank_details",
      timestamps: false,       // because we manually handle created_at/updated_at
      underscored: true,      // snake_case column names
    }
  );

  UserBankDetail.associate = (models) => {
    UserBankDetail.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "user",
    });
  };
  // Optional: define association (if you want to use Sequelize's relation methods)
  // You can later call User.hasOne(UserBankDetail, { foreignKey: 'user_id' });
  // and UserBankDetail.belongsTo(User, { foreignKey: 'user_id' });

  return UserBankDetail;
};