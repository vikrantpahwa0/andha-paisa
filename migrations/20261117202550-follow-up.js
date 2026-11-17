"use strict";

export default {
  async up(queryInterface, Sequelize) {
    // --- templates: follow-up content ---
    await queryInterface.addColumn("templates", "follow_up_1_subject", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("templates", "follow_up_1_body", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("templates", "follow_up_2_subject", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("templates", "follow_up_2_body", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // --- applications: tracking ---
    await queryInterface.addColumn("applications", "stop_follow_up", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    await queryInterface.addColumn("applications", "follow_up_1_sent_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("applications", "follow_up_2_sent_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("templates", "follow_up_1_subject");
    await queryInterface.removeColumn("templates", "follow_up_1_body");
    await queryInterface.removeColumn("templates", "follow_up_2_subject");
    await queryInterface.removeColumn("templates", "follow_up_2_body");

    await queryInterface.removeColumn("applications", "stop_follow_up");
    await queryInterface.removeColumn("applications", "follow_up_1_sent_at");
    await queryInterface.removeColumn("applications", "follow_up_2_sent_at");
  },
};
