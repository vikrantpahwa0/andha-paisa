import { Op } from "sequelize";

export default {
  async up(queryInterface, Sequelize) {
    // Add registration_used column to verifications table
    await queryInterface.addColumn("verifications", "registration_used", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: "Indicates whether the verification record has been used for registration",
    });
  },

  async down(queryInterface) {
    // Remove the column if rolling back
    await queryInterface.removeColumn("verifications", "registration_used");
  },
};