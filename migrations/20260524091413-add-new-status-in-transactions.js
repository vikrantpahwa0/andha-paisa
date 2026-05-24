import { Op } from "sequelize";

export default {
  async up(queryInterface, Sequelize) {
    // PostgreSQL requires dropping and recreating the ENUM type
    // For MySQL/MariaDB, you can modify the column directly

    // For PostgreSQL:
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_surveys_transactions_status" ADD VALUE IF NOT EXISTS 'REJECTED';
    `);

    // For MySQL/MariaDB (alternative approach):
    // await queryInterface.changeColumn("users_surveys_transactions", "status", {
    //   type: Sequelize.ENUM("ASSIGNED", "ATTEMPTED", "COMPLETED", "REJECTED"),
    //   allowNull: false,
    //   defaultValue: "ASSIGNED",
    // });
  },

  async down(queryInterface, Sequelize) {
    // PostgreSQL doesn't allow removing values from ENUM easily
    // You would need to create a new ENUM type and migrate
    // For MySQL/MariaDB:
    // await queryInterface.changeColumn("users_surveys_transactions", "status", {
    //   type: Sequelize.ENUM("ASSIGNED", "ATTEMPTED", "COMPLETED"),
    //   allowNull: false,
    //   defaultValue: "ASSIGNED",
    // });

    // For PostgreSQL (if you must rollback):
    await queryInterface.sequelize.query(`
      -- Create new enum without 'REJECTED'
      CREATE TYPE "enum_users_surveys_transactions_status_new" AS ENUM('ASSIGNED', 'ATTEMPTED', 'COMPLETED');
      
      -- Update the column to use the new enum
      ALTER TABLE "users_surveys_transactions" 
        ALTER COLUMN "status" TYPE "enum_users_surveys_transactions_status_new" 
        USING ("status"::text::"enum_users_surveys_transactions_status_new");
      
      -- Drop the old enum
      DROP TYPE "enum_users_surveys_transactions_status";
      
      -- Rename the new enum
      ALTER TYPE "enum_users_surveys_transactions_status_new" 
        RENAME TO "enum_users_surveys_transactions_status";
    `);
  },
};
