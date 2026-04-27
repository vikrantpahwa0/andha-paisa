// migrations/XXXXXXXXXXXXXX-add-is-active-to-survey-tables.js

"use strict";

export default {
  up: async (queryInterface, Sequelize) => {
    // Add is_active to surveys_questions table
    await queryInterface.addColumn("surveys_questions", "is_active", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });

    // Add is_active to surveys_questions_options table
    await queryInterface.addColumn("surveys_questions_options", "is_active", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove is_active from surveys_questions table
    await queryInterface.removeColumn("surveys_questions", "is_active");

    // Remove is_active from surveys table
    await queryInterface.removeColumn("surveys", "is_active");
  },
};
