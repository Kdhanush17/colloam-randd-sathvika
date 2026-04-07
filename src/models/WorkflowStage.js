const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WorkflowStage = sequelize.define('WorkflowStage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    workspace_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'workspaces',
        key: 'workspace_id',
      },
      index: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    is_system: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      defaultValue: 'ACTIVE',
    },
  }, {
    tableName: 'workflow_stages',
    timestamps: true,
  });

  WorkflowStage.associate = function (models) {
    // Add associations here if needed
  };

  return WorkflowStage;
};
