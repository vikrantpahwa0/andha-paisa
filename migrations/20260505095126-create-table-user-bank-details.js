// migrations/xxxx-create-user-bank-details.js
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users_bank_details", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      account_holder_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ifsc_code: {
        type: Sequelize.STRING(11),
        allowNull: false,
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

    // Add unique index on user_id (one bank detail per user)
    await queryInterface.addIndex("users_bank_details", ["user_id"], {
      unique: true,
      name: "unique_user_bank_detail",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users_bank_details");
  },
};