// migrations/YYYYMMDDHHMMSS-add-profile-picture-to-users.js
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "profilePicture", {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "URL to user's profile picture",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "profilePicture");
  },
};