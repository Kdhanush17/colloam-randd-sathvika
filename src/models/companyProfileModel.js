const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  let CompanyProfile = sequelize.define('company_profile', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    companyCode: {
      type: DataTypes.STRING(100)
    },

    companyName: {
      allowNull: false,
      type: DataTypes.STRING(255),
      unique: true
    },

    companyWebsite: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    industryType: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    companyDescription: DataTypes.TEXT,

    yearOfEstablishment: DataTypes.INTEGER,

    companySize: DataTypes.STRING(100),

    companyLogo: DataTypes.TEXT,

    corporateEmail: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    supportEmail: DataTypes.STRING(255),

    country_code: DataTypes.INTEGER,

    phoneNumber: DataTypes.STRING(20),
    extensionNumber: DataTypes.STRING(20),
    alternatePhone: DataTypes.STRING(20),

    // ✅ Address as JSONB
    address: {
      type: DataTypes.JSONB
    },

    // ✅ Branches array → JSONB
    branches: {
      type: DataTypes.JSONB
    },

    taxIdentificationNumber: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },

    businessRegistrationNumber: DataTypes.STRING(255),

    businessLicenseDocument: {
      allowNull: false,
      type: DataTypes.TEXT
    },

    taxExemptionCertificate: DataTypes.TEXT,

    approvalStatus: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING'
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    createdOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    updatedOn: {
      type: DataTypes.DATE
    }

  }, {
    tableName: 'company_profile',
    timestamps: false
  });

  return CompanyProfile;
};