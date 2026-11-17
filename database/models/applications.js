export default function (sequelize, DataTypes) {
  const APPLICATIONS = sequelize.define(
    "applications",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      template_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      to_emails: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      subject: { type: DataTypes.TEXT, allowNull: false },
      rendered_subject: { type: DataTypes.TEXT, allowNull: true },
      rendered_body: { type: DataTypes.TEXT, allowNull: true },
      variables: { type: DataTypes.JSONB, defaultValue: {} },
      status: {
        type: DataTypes.ENUM("SENT", "PARTIAL", "FAILED"),
        defaultValue: "SENT",
      },
      error: { type: DataTypes.TEXT, allowNull: true },
      sent_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "applications",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  APPLICATIONS.associate = (models) => {
    // FIXED: Uppercase TEMPLATES
    APPLICATIONS.belongsTo(models.TEMPLATES, {
      foreignKey: "template_id",
      as: "template",
    });
  };

  return APPLICATIONS;
}
