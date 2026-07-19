// src/models/Image.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Image = sequelize.define(
    "Image",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      code: {
        type: DataTypes.ENUM(
          "PROD", // Product images
          "USER", // User profile images
          "SURVEY", // Survey images
          "BANNER", // Banner images
          "OFFER", // Offer images
          "OTHER", // Other images
        ),
        allowNull: false,
        defaultValue: "OTHER",
        comment: "Type of image to identify where it's used",
      },

      path: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: "URL or file path to the image",
      },

      filename: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Original filename",
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
      tableName: "images",
      timestamps: false,
      indexes: [
        {
          fields: ["code"],
          name: "idx_images_code",
        },
        {
          fields: ["is_active"],
          name: "idx_images_active",
        },
        {
          fields: ["created_at"],
          name: "idx_images_created_at",
        },
      ],
    },
  );

  Image.associate = (models) => {
    Image.hasMany(models.ProductImage, {
      foreignKey: "image_id",
      as: "productImages",
    });
  };

  return Image;
};
