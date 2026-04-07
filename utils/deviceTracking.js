// Device Login Tracking Middleware for API endpoints
// Use this middleware on any login/authentication endpoint to track device details

const { captureDeviceDetails, generateDeviceToken } = require('./deviceDetection');

/**
 * Track device login for a user
 * @param {Object} db - Database instance
 * @param {Integer} userId - User ID from database
 * @param {String} userCode - User UUID code
 * @param {Object} req - Express request object
 * @param {String} source - Source of login (e.g., 'api', 'web', 'mobile')
 * @returns {Promise<Object>} Device login record
 */
const trackDeviceLogin = async (db, userId, userCode, req, source = 'api') => {
  try {
    const deviceDetails = captureDeviceDetails(req);
    const deviceToken = generateDeviceToken();
    const now = new Date();

    // Check if device already exists
    const existingDevice = await db.device_login.findOne({
      where: {
        user_id: userId,
        ip_address: deviceDetails.ip_address,
        browser_name: deviceDetails.browser_name,
        os_name: deviceDetails.os_name
      }
    });

    if (existingDevice) {
      // Update existing device login
      await existingDevice.update({
        last_login_at: now,
        last_activity_at: now,
        login_count: existingDevice.login_count + 1,
        user_agent: deviceDetails.user_agent,
        is_active: true,
        device_token: deviceToken
      });

      console.log(`✅ Updated device login for user ${userId}: ${deviceDetails.device_name}`);
      return existingDevice;
    } else {
      // Create new device login
      const deviceLogin = await db.device_login.create({
        user_id: userId,
        userCode: userCode,
        device_name: deviceDetails.device_name,
        device_type: deviceDetails.device_type,
        browser_name: deviceDetails.browser_name,
        browser_version: deviceDetails.browser_version,
        os_name: deviceDetails.os_name,
        os_version: deviceDetails.os_version,
        ip_address: deviceDetails.ip_address,
        user_agent: deviceDetails.user_agent,
        device_token: deviceToken,
        last_login_at: now,
        last_activity_at: now,
        login_count: 1,
        is_active: true
      });

      console.log(`✅ Created new device login for user ${userId}: ${deviceDetails.device_name}`);
      return deviceLogin;
    }
  } catch (error) {
    console.error('❌ Error tracking device login:', error);
    throw error;
  }
};

/**
 * Track device login for a user in tenant database
 * @param {Object} tenantModels - Tenant models instance
 * @param {Integer} userId - User ID from tenant database
 * @param {String} userCode - User UUID code
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Device login record
 */
const trackTenantDeviceLogin = async (tenantModels, userId, userCode, req) => {
  try {
    const deviceDetails = captureDeviceDetails(req);
    const deviceToken = generateDeviceToken();
    const now = new Date();

    // Check if device already exists
    const existingDevice = await tenantModels.device_login.findOne({
      where: {
        user_id: userId,
        ip_address: deviceDetails.ip_address,
        browser_name: deviceDetails.browser_name,
        os_name: deviceDetails.os_name
      }
    });

    if (existingDevice) {
      // Update existing device login
      await existingDevice.update({
        last_login_at: now,
        last_activity_at: now,
        login_count: existingDevice.login_count + 1,
        user_agent: deviceDetails.user_agent,
        is_active: true,
        device_token: deviceToken
      });

      console.log(`✅ Updated tenant device login for user ${userId}: ${deviceDetails.device_name}`);
      return existingDevice;
    } else {
      // Create new device login
      const deviceLogin = await tenantModels.device_login.create({
        user_id: userId,
        userCode: userCode,
        device_name: deviceDetails.device_name,
        device_type: deviceDetails.device_type,
        browser_name: deviceDetails.browser_name,
        browser_version: deviceDetails.browser_version,
        os_name: deviceDetails.os_name,
        os_version: deviceDetails.os_version,
        ip_address: deviceDetails.ip_address,
        user_agent: deviceDetails.user_agent,
        device_token: deviceToken,
        last_login_at: now,
        last_activity_at: now,
        login_count: 1,
        is_active: true
      });

      console.log(`✅ Created new tenant device login for user ${userId}: ${deviceDetails.device_name}`);
      return deviceLogin;
    }
  } catch (error) {
    console.error('❌ Error tracking tenant device login:', error);
    throw error;
  }
};

/**
 * Get all active devices for a user
 * @param {Object} db - Database instance
 * @param {Integer} userId - User ID
 * @returns {Promise<Array>} Array of active devices
 */
const getActiveDevices = async (db, userId) => {
  try {
    const devices = await db.device_login.findAll({
      where: {
        user_id: userId,
        is_active: true
      },
      order: [['last_login_at', 'DESC']]
    });

    return devices;
  } catch (error) {
    console.error('❌ Error fetching active devices:', error);
    throw error;
  }
};

/**
 * Logout device by device_id
 * @param {Object} db - Database instance
 * @param {Integer} deviceId - Device ID
 * @returns {Promise<void>}
 */
const logoutDevice = async (db, deviceId) => {
  try {
    await db.device_login.update(
      {
        is_active: false,
        updated_at: new Date()
      },
      {
        where: { id: deviceId }
      }
    );

    console.log(`✅ Device ${deviceId} logged out`);
  } catch (error) {
    console.error('❌ Error logging out device:', error);
    throw error;
  }
};

/**
 * Logout all devices for a user except current
 * @param {Object} db - Database instance
 * @param {Integer} userId - User ID
 * @param {String} currentDeviceToken - Current device token to exclude
 * @returns {Promise<void>}
 */
const logoutAllOtherDevices = async (db, userId, currentDeviceToken) => {
  try {
    await db.device_login.update(
      {
        is_active: false,
        updated_at: new Date()
      },
      {
        where: {
          user_id: userId,
          device_token: { [require('sequelize').Op.ne]: currentDeviceToken }
        }
      }
    );

    console.log(`✅ All other devices logged out for user ${userId}`);
  } catch (error) {
    console.error('❌ Error logging out other devices:', error);
    throw error;
  }
};

module.exports = {
  trackDeviceLogin,
  trackTenantDeviceLogin,
  getActiveDevices,
  logoutDevice,
  logoutAllOtherDevices
};
