import { POSITIONS } from "../constants/positions.js";

export default function (sequelize, DataTypes) {
  const TEMPLATES = sequelize.define(
    "templates",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(150), allowNull: false },
      position: {
        type: DataTypes.ENUM(...POSITIONS),
        allowNull: false,
      },
      recruiter_email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { isEmail: true },
      },
      subject: { type: DataTypes.TEXT, allowNull: false },
      body: { type: DataTypes.TEXT, allowNull: false },
      resume_path: { type: DataTypes.STRING(500), allowNull: true },
      resume_original_name: { type: DataTypes.STRING(255), allowNull: true },
      resume_mime: { type: DataTypes.STRING(120), allowNull: true },
      resume_size: { type: DataTypes.INTEGER, allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      tableName: "templates",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  TEMPLATES.associate = (models) => {
    // FIXED: Uppercase APPLICATIONS
    TEMPLATES.hasMany(models.APPLICATIONS, {
      foreignKey: "template_id",
      as: "applications",
      onDelete: "RESTRICT",
    });
  };

  return TEMPLATES;
}
