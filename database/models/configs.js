import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Config = sequelize.define(
    "Config",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: "Unique identifier for the configuration key (e.g., WITHDRAWAL_LIMIT, REFERRAL_BONUS)",
      },

      value: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Stored value – can be string, JSON string, or number (parsed by application)",
      },

      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Human-readable description of what this config does",
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
      tableName: "configs",
      timestamps: false,
    }
  );

  // Optional: add any associations if needed (Config belongs to User? Probably not)
  Config.associate = (models) => {
    // Example: Config.belongsTo(models.User, { foreignKey: 'created_by' });
  };

  return Config;
};