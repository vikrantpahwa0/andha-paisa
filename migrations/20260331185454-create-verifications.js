export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("verifications", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      country_code: Sequelize.STRING(5),
      mobile: Sequelize.STRING(15),
      email: Sequelize.STRING,
      verification_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      expires_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("verifications");
  },
};
