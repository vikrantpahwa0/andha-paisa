// migrations/XXXXXXXXXX-create-products-and-related-tables.js
export default {
  async up(queryInterface, Sequelize) {
    // 1. Create products_category table
    await queryInterface.createTable("products_category", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    // Insert default categories
    await queryInterface.bulkInsert("products_category", [
      { name: "Gift Cards", created_at: new Date(), updated_at: new Date() },
      { name: "Cash", created_at: new Date(), updated_at: new Date() },
      { name: "Electronics", created_at: new Date(), updated_at: new Date() },
      { name: "Merchandise", created_at: new Date(), updated_at: new Date() },
      { name: "Food", created_at: new Date(), updated_at: new Date() },
      { name: "Fashion", created_at: new Date(), updated_at: new Date() },
      { name: "Other", created_at: new Date(), updated_at: new Date() },
    ]);

    // 2. Create products table
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "products_category",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      points_required: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      tags: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    // 3. Create images table
    await queryInterface.createTable("images", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: Sequelize.ENUM(
          "PROD",
          "USER",
          "SURVEY",
          "BANNER",
          "OFFER",
          "OTHER"
        ),
        allowNull: false,
        defaultValue: "OTHER",
      },
      path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      filename: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    // 4. Create products_image junction table
    await queryInterface.createTable("products_image", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      image_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "images",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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

    // Add indexes for better performance
    await queryInterface.addIndex("products", ["category_id"]);
    await queryInterface.addIndex("products", ["is_active"]);
    await queryInterface.addIndex("products", ["created_at"]);
    await queryInterface.addIndex("images", ["code"]);
    await queryInterface.addIndex("images", ["is_active"]);
    await queryInterface.addIndex("images", ["created_at"]);
    await queryInterface.addIndex("products_image", ["product_id"]);
    await queryInterface.addIndex("products_image", ["image_id"]);
    await queryInterface.addIndex("products_image", ["display_order"]);

    // Add unique constraint for products_image pair
    await queryInterface.addConstraint("products_image", {
      fields: ["product_id", "image_id"],
      type: "unique",
      name: "unique_products_image",
    });
  },

  async down(queryInterface) {
    // Drop tables in reverse order (respecting foreign key constraints)
    await queryInterface.dropTable("products_image");
    await queryInterface.dropTable("images");
    await queryInterface.dropTable("products");
    await queryInterface.dropTable("products_category");
  },
};