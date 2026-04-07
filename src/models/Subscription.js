const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const Subscription = sequelize.define(
  'Subscription',
  {
    subscription_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    workspace_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'workspaces',
        key: 'workspace_id',
      },
      index: true,
    },
    plan: {
      type: DataTypes.ENUM('free', 'starter', 'team', 'business', 'enterprise'),
      defaultValue: 'free',
      index: true,
    },
    billing_cycle: {
      type: DataTypes.ENUM('monthly', 'yearly'),
      defaultValue: 'monthly',
    },
    status: {
      type: DataTypes.ENUM('active', 'past_due', 'cancelled', 'pending'),
      defaultValue: 'active',
      index: true,
    },
    trial_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '7-day free trial expiration',
    },
    subscription_started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    auto_renewal_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Next renewal date',
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    stripe_subscription_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stripe_customer_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    max_users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Maximum team members allowed',
    },
    max_brands: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Maximum brands allowed',
    },
    storage_limit_bytes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 5368709120, // 5GB in bytes for free plan
      comment: 'Total storage limit in bytes',
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
    tableName: 'subscriptions',
    timestamps: false,
    indexes: [
      { fields: ['workspace_id'] },
      { fields: ['plan', 'status'] },
      { fields: ['auto_renewal_at'] },
    ],
  }
);

return Subscription
}
