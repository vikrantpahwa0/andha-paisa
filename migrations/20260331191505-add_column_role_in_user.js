export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "role", {
      type: Sequelize.ENUM("US", "AD"),
      defaultValue: "US",
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "role");

    // Optional cleanup (important for Postgres)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role";',
    );
  },
};
