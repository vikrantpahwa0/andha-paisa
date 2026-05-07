// migrations/YYYYMMDDHHMMSS-create-configs-table.js
import { Op } from "sequelize";

export default {
  async up(queryInterface, Sequelize) {
    // 1. Create table
    await queryInterface.createTable("configs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: "Unique identifier for the configuration key (e.g., WITHDRAWAL_LIMIT, REFERRAL_BONUS)",
      },
      value: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "Stored value – can be string, JSON string, or number (parsed by application)",
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Human-readable description of what this config does",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // 2. Insert initial config values
    await queryInterface.bulkInsert("configs", [
      {
        code: "WITHDRAW_LIMIT",
        value: "500",
        comment: "Withdraw Limit",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "SURVEY_REWARD_POINTS",
        value: "10",
        comment: "Survey reward Points multiplier",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    // Remove seeded entries before dropping table
    await queryInterface.bulkDelete("configs", {
      code: { [Op.in]: ["WITHDRAW_LIMIT", "SURVEY_REWARD_POINTS"] },
    });
    // Drop the table
    await queryInterface.dropTable("configs");
  },
};