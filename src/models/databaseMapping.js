const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DatabaseMapping = sequelize.define("database_mappings", {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    userCode: {
      type: DataTypes.UUID,
    },

    workspace_id: {
      type: DataTypes.STRING(100), // unique tenant identifier
    },

    database: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    db_username: {
      type: DataTypes.STRING(255),
    },

    db_password: {
      type: DataTypes.STRING(255),
    },

    db_host: {
      type: DataTypes.STRING(255),
      defaultValue: "localhost"
    },

    db_port: {
      type: DataTypes.INTEGER,
      defaultValue: 5432
    },

    // Optional: store tenant users
    users: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }

  }, {
    tableName: "database_mappings",
    timestamps: true,
  });
  // DatabaseMapping.associate = function (models) {
  //   DatabaseMapping.belongsTo(models.user_account, {
  //     foreignKey: "userCode",
  //     targetKey: "userCode", // 🔥 important
  //     as: "user",
  //     onDelete: "SET NULL", // Allow userCode to be null if user_account is deleted
  //     onUpdate: "CASCADE" // Update userCode if user_account userCode changes
  //   });
  // };
  return DatabaseMapping;
};