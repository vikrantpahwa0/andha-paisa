// migrations/XXXXXXXXXXXXXX-update-surveys-table.js

"use strict";

export default {
  up: async (queryInterface, Sequelize) => {
    // Modify code column to allow null (since we'll update it after creation)
    await queryInterface.changeColumn("surveys", "code", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert back to not allowing null
    await queryInterface.changeColumn("surveys", "code", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
};
