// migrations/XXXXXXXXXX-create-templates-and-applications-tables.js
export default {
  async up(queryInterface, Sequelize) {
    // 1. Create templates table
    await queryInterface.createTable("templates", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      position: {
        type: Sequelize.ENUM(
          "FULL_STACK",
          "NODE_JS",
          "MERN",
          "BACKEND",
          "PYTHON",
          "PYTHON_BACKEND",
        ),
        allowNull: false,
      },
      recruiter_email: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      subject: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      resume_path: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      resume_original_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      resume_mime: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      resume_size: {
        type: Sequelize.INTEGER,
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

    // 2. Create applications table
    await queryInterface.createTable("applications", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      template_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "templates",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      to_emails: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      subject: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      rendered_subject: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rendered_body: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      variables: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("SENT", "PARTIAL", "FAILED"),
        defaultValue: "SENT",
      },
      error: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    // 3. Indexes for templates
    await queryInterface.addIndex("templates", ["position"]);
    await queryInterface.addIndex("templates", ["recruiter_email"]);
    await queryInterface.addIndex("templates", ["is_active"]);
    await queryInterface.addIndex("templates", ["created_at"]);

    // 4. Indexes for applications
    await queryInterface.addIndex("applications", ["template_id"]);
    await queryInterface.addIndex("applications", ["status"]);
    await queryInterface.addIndex("applications", ["created_at"]);
    await queryInterface.addIndex("applications", ["sent_at"]);
  },

  async down(queryInterface) {
    // Drop in reverse FK order
    await queryInterface.dropTable("applications");
    await queryInterface.dropTable("templates");

    // Postgres keeps ENUM types alive after dropTable — clean them up
    // so re-running `db:migrate` doesn't fail with "type already exists".
    if (queryInterface.sequelize.getDialect() === "postgres") {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_applications_status";',
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_templates_position";',
      );
    }
  },
};
