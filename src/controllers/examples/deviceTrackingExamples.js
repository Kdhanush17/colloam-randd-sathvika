// Device Tracking API Implementation Examples
// Add these to your controllers/routes as needed

const db = require("../../models/index");
const { trackDeviceLogin, getActiveDevices, logoutDevice, logoutAllOtherDevices } = require("../../../utils/deviceTracking");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const env = require("../../../config/environment");

/**
 * LOGIN ENDPOINT WITH DEVICE TRACKING
 * POST /api/auth/login
 */
async function loginWithDeviceTracking(req, res) {
  try {
    const { email, password, logoutOthers } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await db.user_account.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Track device login
    const deviceLogin = await trackDeviceLogin(
      db,
      user.id,
      user.userCode,
      req,
      'login'
    );

    // Optionally logout all other devices
    if (logoutOthers === true) {
      await logoutAllOtherDevices(db, user.id, deviceLogin.device_token);
    }

    // Generate JWT with device token
    const token = jwt.sign(
      {
        userId: user.id,
        userCode: user.userCode,
        email: user.email,
        deviceToken: deviceLogin.device_token
      },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    // Update last login
    await user.update({ last_login_at: new Date() });

    res.json({
      status: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        workspace_name: user.workspace_name
      },
      device: {
        device_id: deviceLogin.device_id,
        device_name: deviceLogin.device_name,
        device_token: deviceLogin.device_token
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

/**
 * GET ALL ACTIVE DEVICES FOR CURRENT USER
 * GET /api/user/devices
 */
async function getUserDevices(req, res) {
  try {
    const userId = req.user.id;
    const currentDeviceToken = req.deviceToken; // Extracted from JWT

    const devices = await getActiveDevices(db, userId);

    res.json({
      status: true,
      data: devices.map(device => ({
        device_id: device.device_id,
        device_name: device.device_name,
        device_type: device.device_type,
        browser: `${device.browser_name} ${device.browser_version}`,
        os: `${device.os_name} ${device.os_version}`,
        ip_address: device.ip_address,
        last_login: device.last_login_at,
        last_activity: device.last_activity_at,
        login_count: device.login_count,
        is_current: device.device_token === currentDeviceToken,
        is_active: device.is_active
      })),
      total_devices: devices.length
    });

  } catch (error) {
    console.error('❌ Error fetching devices:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

/**
 * LOGOUT A SPECIFIC DEVICE
 * POST /api/user/logout-device/:deviceId
 */
async function logoutSpecificDevice(req, res) {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;

    // Verify device belongs to current user
    const device = await db.device_login.findOne({
      where: {
        id: deviceId,
        user_id: userId
      }
    });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    await logoutDevice(db, deviceId);

    res.json({
      status: true,
      message: `Device "${device.device_name}" has been logged out successfully`
    });

  } catch (error) {
    console.error('❌ Error logging out device:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

/**
 * LOGOUT ALL DEVICES EXCEPT CURRENT
 * POST /api/user/logout-all-other-devices
 */
async function logoutAllOtherDevicesAPI(req, res) {
  try {
    const userId = req.user.id;
    const currentDeviceToken = req.deviceToken;

    await logoutAllOtherDevices(db, userId, currentDeviceToken);

    res.json({
      status: true,
      message: "All other devices have been logged out successfully"
    });

  } catch (error) {
    console.error('❌ Error logging out other devices:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

/**
 * GET DEVICE LOGIN HISTORY FOR A USER
 * GET /api/user/device-history/:deviceId
 */
async function getDeviceHistory(req, res) {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;

    const device = await db.device_login.findOne({
      where: {
        device_id: deviceId,
        user_id: userId
      }
    });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json({
      status: true,
      device: {
        device_id: device.device_id,
        device_name: device.device_name,
        device_type: device.device_type,
        browser: `${device.browser_name} ${device.browser_version}`,
        os: `${device.os_name} ${device.os_version}`,
        ip_address: device.ip_address,
        first_login: device.createdOn,
        last_login: device.last_login_at,
        last_activity: device.last_activity_at,
        total_logins: device.login_count,
        is_active: device.is_active
      }
    });

  } catch (error) {
    console.error('❌ Error fetching device history:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

/**
 * UPDATE DEVICE ACTIVITY (Call periodically to track active sessions)
 * POST /api/user/update-device-activity
 */
async function updateDeviceActivity(req, res) {
  try {
    const deviceToken = req.deviceToken;
    const userId = req.user.id;

    const device = await db.device_login.findOne({
      where: {
        user_id: userId,
        device_token: deviceToken
      }
    });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    await device.update({
      last_activity_at: new Date()
    });

    res.json({
      status: true,
      message: "Device activity updated"
    });

  } catch (error) {
    console.error('❌ Error updating device activity:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

/**
 * GET SUSPICIOUS LOGIN ATTEMPTS
 * GET /api/user/suspicious-logins
 */
async function getSuspiciousLogins(req, res) {
  try {
    const userId = req.user.id;
    const { Op } = require('sequelize');

    // Get devices created in the last 24 hours with login_count = 1
    const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const suspiciousDevices = await db.device_login.findAll({
      where: {
        user_id: userId,
        createdOn: { [Op.gte]: lastDay },
        login_count: 1
      },
      order: [['createdOn', 'DESC']]
    });

    res.json({
      status: true,
      suspicious_logins: suspiciousDevices.map(device => ({
        device_id: device.device_id,
        device_name: device.device_name,
        device_type: device.device_type,
        ip_address: device.ip_address,
        browser: `${device.browser_name} ${device.browser_version}`,
        os: `${device.os_name} ${device.os_version}`,
        login_time: device.createdOn,
        alert: "New device login detected"
      })),
      count: suspiciousDevices.length
    });

  } catch (error) {
    console.error('❌ Error fetching suspicious logins:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

/**
 * EXAMPLE ROUTE DEFINITIONS
 * Add these to your router/routes file
 */
const exampleRoutes = `
// Device Management Routes

// Authentication
router.post('/auth/login', loginWithDeviceTracking);

// Device Management (Protected by JWT middleware)
router.get('/user/devices', authMiddleware, getUserDevices);
router.post('/user/logout-device/:deviceId', authMiddleware, logoutSpecificDevice);
router.post('/user/logout-all-other-devices', authMiddleware, logoutAllOtherDevicesAPI);
router.get('/user/device-history/:deviceId', authMiddleware, getDeviceHistory);
router.post('/user/update-device-activity', authMiddleware, updateDeviceActivity);
router.get('/user/suspicious-logins', authMiddleware, getSuspiciousLogins);
`;

/**
 * AUTH MIDDLEWARE TO EXTRACT DEVICE TOKEN
 * Add this before your routes
 */
const authMiddlewareWithDeviceToken = `
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    req.deviceToken = decoded.deviceToken; // Extract device token

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
`;

module.exports = {
  loginWithDeviceTracking,
  getUserDevices,
  logoutSpecificDevice,
  logoutAllOtherDevicesAPI,
  getDeviceHistory,
  updateDeviceActivity,
  getSuspiciousLogins
};
