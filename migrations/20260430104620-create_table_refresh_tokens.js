// migrations/20240101000000-create-users-refresh-tokens-table.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    // Create table without transaction for CONCURRENTLY indexes
    await queryInterface.createTable('users_refresh_tokens', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes without CONCURRENTLY or disable transaction
    await queryInterface.addIndex('users_refresh_tokens', ['user_id'], {
      name: 'users_refresh_tokens_user_id_idx'
    });
    await queryInterface.addIndex('users_refresh_tokens', ['token'], {
      name: 'users_refresh_tokens_token_idx'
    });
    await queryInterface.addIndex('users_refresh_tokens', ['expires_at'], {
      name: 'users_refresh_tokens_expires_at_idx'
    });
    await queryInterface.addIndex('users_refresh_tokens', ['is_active'], {
      name: 'users_refresh_tokens_is_active_idx'
    });
    await queryInterface.addIndex('users_refresh_tokens', ['user_id', 'is_active'], {
      name: 'users_refresh_tokens_user_active_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex('users_refresh_tokens', 'users_refresh_tokens_user_id_idx');
    await queryInterface.removeIndex('users_refresh_tokens', 'users_refresh_tokens_token_idx');
    await queryInterface.removeIndex('users_refresh_tokens', 'users_refresh_tokens_expires_at_idx');
    await queryInterface.removeIndex('users_refresh_tokens', 'users_refresh_tokens_is_active_idx');
    await queryInterface.removeIndex('users_refresh_tokens', 'users_refresh_tokens_user_active_idx');
    
    // Drop table
    await queryInterface.dropTable('users_refresh_tokens');
  }
};