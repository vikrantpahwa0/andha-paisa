// src/models/Product.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products_category",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      points_required: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },

      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Optional expiry date for the product",
      },

      tags: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Comma-separated tags or JSON string",
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: "Soft delete flag",
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "products",
      timestamps: false,
      indexes: [
        {
          fields: ["category_id"],
          name: "idx_products_category_id",
        },
        {
          fields: ["is_active"],
          name: "idx_products_active",
        },
        {
          fields: ["created_at"],
          name: "idx_products_created_at",
        },
      ],
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });

    Product.belongsToMany(models.Image, {
      through: models.ProductImage,
      foreignKey: "product_id",
      otherKey: "image_id",
      as: "images",
    });

    Product.hasMany(models.ProductImage, {
      foreignKey: "product_id",
      as: "productImages",
    });
  };

  return Product;
};