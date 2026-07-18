// src/models/ProductImage.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProductImage = sequelize.define(
    "ProductImage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      image_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "images",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "Order in which images should be displayed (0 = first)",
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
      tableName: "products_image",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["product_id", "image_id"],
          name: "unique_products_image",
        },
        {
          fields: ["product_id"],
          name: "idx_products_image_product",
        },
        {
          fields: ["image_id"],
          name: "idx_products_image_image",
        },
        {
          fields: ["display_order"],
          name: "idx_products_image_order",
        },
      ],
    }
  );

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });

    ProductImage.belongsTo(models.Image, {
      foreignKey: "image_id",
      as: "image",
    });
  };

  return ProductImage;
};