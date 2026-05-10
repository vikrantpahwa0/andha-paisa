"use strict";

export default {
  up: async (queryInterface, Sequelize) => {
    // 1. Create spin_prizes table
    await queryInterface.createTable("spin_prizes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      probability: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING,
        defaultValue: "#94a3b8",
        allowNull: false,
      },
      segment_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    // 2. Create spin_transactions table
    await queryInterface.createTable("spin_transactions", {
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
      prize_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "spin_prizes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rotation_angle: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 3. Add indexes
    await queryInterface.addIndex("spin_transactions", ["user_id"]);
    await queryInterface.addIndex("spin_transactions", ["created_at"]);
    await queryInterface.addIndex("spin_prizes", ["is_active"]);
    await queryInterface.addIndex("spin_prizes", ["segment_index"]);

    // 4. Insert default prizes
    await queryInterface.bulkInsert("spin_prizes", [
      {
        name: "10 points",
        value: 10,
        probability: 0.1,
        color: "#86efac",
        segment_index: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "20 points",
        value: 20,
        probability: 0.1,
        color: "#4ade80",
        segment_index: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "50 points",
        value: 50,
        probability: 0.1,
        color: "#22c55e",
        segment_index: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "100 points",
        value: 100,
        probability: 0.1,
        color: "#10b981",
        segment_index: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Try again",
        value: 0,
        probability: 0.6,
        color: "#94a3b8",
        segment_index: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("spin_transactions");
    await queryInterface.dropTable("spin_prizes");
  },
};
