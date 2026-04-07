const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let Blog = sequelize.define('blogs', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    blogCode: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },

    blogName: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    blogSubject: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    blogThumbnail: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    blogDescription: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    created_date: {
      allowNull: true,
      type: DataTypes.DATE
    },

    updated_date: {
      allowNull: true,
      type: DataTypes.DATE
    },

    external_link: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },

    // ✅ Nested array → JSONB
    blog_list: {
      allowNull: true,
      type: DataTypes.JSONB
    },

    blogStatus: {
      allowNull: true,
      type: DataTypes.ENUM('ACTIVE', 'DEACTIVE'),
      defaultValue: 'ACTIVE'
    }

  }, {
    tableName: 'blogs',
    timestamps: false
  });

  return Blog;
};