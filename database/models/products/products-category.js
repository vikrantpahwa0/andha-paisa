// src/models/Category.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: "products_category",
      timestamps: false,
      indexes: [
        {
          fields: ["is_active"],
          name: "idx_products_category_active",
        },
      ],
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: "category_id",
      as: "products",
    });
  };

  return Category;
};