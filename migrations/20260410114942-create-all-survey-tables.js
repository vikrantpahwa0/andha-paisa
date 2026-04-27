// migrations/YYYYMMDDHHMMSS-create-all-survey-tables.js
"use strict";

export default {
  up: async (queryInterface, Sequelize) => {
    // 1. Create surveys table
    await queryInterface.createTable("surveys", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reward: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 2. Create surveys_questions table
    await queryInterface.createTable("surveys_questions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      question_type: {
        type: Sequelize.ENUM("email", "mobile", "with_options", "input"),
        allowNull: false,
      },
      survey_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "surveys",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 3. Create surveys_questions_options table
    await queryInterface.createTable("surveys_questions_options", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "surveys_questions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      option_text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 4. Create users_surveys_transactions table
    await queryInterface.createTable("users_surveys_transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      survey_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "surveys",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM("ASSIGNED", "ATTEMPTED", "COMPLETED"),
        allowNull: false,
        defaultValue: "ASSIGNED",
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Add composite index for user_id and survey_id
    await queryInterface.addIndex("users_surveys_transactions", [
      "user_id",
      "survey_id",
    ]);

    // 5. Create users_surveys_answers table
    await queryInterface.createTable("users_surveys_answers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users_surveys_transactions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "surveys_questions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      option_chosen_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "surveys_questions_options",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      text_answer: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order to avoid foreign key constraint issues
    await queryInterface.dropTable("users_surveys_answers");
    await queryInterface.dropTable("users_surveys_transactions");
    await queryInterface.dropTable("surveys_questions_options");
    await queryInterface.dropTable("surveys_questions");
    await queryInterface.dropTable("surveys");

    // Drop ENUM types (PostgreSQL specific)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_surveys_questions_question_type";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_surveys_transactions_status";',
    );
  },
};
