# Device Login Tracking System

## Overview
This system captures and stores device login details for improved security and audit trails. It tracks browser info, OS, device type, IP address, and login history for each user across all APIs.

## Components Created

### 1. **DeviceLogin Model** (`src/models/DeviceLogin.js`)
Database model to store device login information in both main and tenant databases.

**Fields:**
- `device_id` - UUID for device identification
- `user_id` - Reference to user
- `userCode` - User UUID code
- `device_name` - Human-readable device name (e.g., "Windows - Chrome")
- `device_type` - ENUM: mobile, tablet, desktop, unknown
- `browser_name` - Browser name (Chrome, Safari, Firefox, Edge, Opera)
- `browser_version` - Browser version
- `os_name` - Operating system (Windows, macOS, Linux, Android, iOS)
- `os_version` - OS version
- `ip_address` - Client IP address (supports IPv4 and IPv6)
- `user_agent` - Full user agent string
- `country` - Country from IP geolocation (optional)
- `city` - City from IP geolocation (optional)
- `is_active` - Whether device is currently logged in
- `device_token` - Unique token for device identification
- `last_login_at` - Last login timestamp
- `last_activity_at` - Last activity timestamp
- `login_count` - Total login count from this device

### 2. **Device Detection Utility** (`src/utils/deviceDetection.js`)
Extracts device information from HTTP requests.

**Functions:**
- `parseUserAgent(userAgent)` - Parse User-Agent string to detect browser and OS
- `getClientIP(req)` - Extract client IP address from request headers
- `captureDeviceDetails(req)` - Capture all device details from request
- `generateDeviceToken()` - Generate unique device token

### 3. **Device Tracking Service** (`src/utils/deviceTracking.js`)
High-level functions to manage device logins and sessions.

**Functions:**
- `trackDeviceLogin(db, userId, userCode, req, source)` - Track or update device login
- `trackTenantDeviceLogin(tenantModels, userId, userCode, req)` - Track device in tenant DB
- `getActiveDevices(db, userId)` - Get all active devices for a user
- `logoutDevice(db, deviceId)` - Logout a specific device
- `logoutAllOtherDevices(db, userId, currentDeviceToken)` - Logout all other devices

## Usage Examples

### Example 1: Track Device Login During Signup (Already implemented in UserSignup)
```javascript
const { captureDeviceDetails, generateDeviceToken } = require('../utils/deviceDetection');

const deviceDetails = captureDeviceDetails(req);
const deviceToken = generateDeviceToken();

await db.device_login.create({
  user_id: user.id,
  userCode: user.userCode,
  device_name: deviceDetails.device_name,
  device_type: deviceDetails.device_type,
  browser_name: deviceDetails.browser_name,
  browser_version: deviceDetails.browser_version,
  os_name: deviceDetails.os_name,
  os_version: deviceDetails.os_version,
  ip_address: deviceDetails.ip_address,
  user_agent: deviceDetails.user_agent,
  device_token: deviceToken,
  last_login_at: new Date(),
  login_count: 1,
  is_active: true
});
```

### Example 2: Track Device Login in Login Controller
```javascript
const { trackDeviceLogin } = require('../utils/deviceTracking');

// After user authentication is successful
const authenticatedUser = await db.user_account.findOne({ where: { email } });

// Track device in main DB
await trackDeviceLogin(db, authenticatedUser.id, authenticatedUser.userCode, req, 'api');

// If tenant DB available, also track there
if (tenantModels) {
  const tenantUser = await tenantModels.user_account.findOne({
    where: { email }
  });
  await trackTenantDeviceLogin(tenantModels, tenantUser.id, tenantUser.userCode, req);
}

// Generate JWT with device token
const token = jwt.sign({
  userId: authenticatedUser.id,
  userCode: authenticatedUser.userCode,
  deviceToken: deviceLogin.device_token
}, env.jwtSecret);
```

### Example 3: Get Active Devices for a User
```javascript
const { getActiveDevices } = require('../utils/deviceTracking');

const activeDevices = await getActiveDevices(db, userId);
console.log('Active devices:', activeDevices);

// Response example:
// [
//   {
//     device_id: 'uuid...',
//     device_name: 'Windows - Chrome',
//     device_type: 'desktop',
//     ip_address: '192.168.1.100',
//     last_login_at: '2025-04-06T10:30:00Z',
//     login_count: 5
//   }
// ]
```

### Example 4: Logout All Other Devices
```javascript
const { logoutAllOtherDevices } = require('../utils/deviceTracking');

// When logging out from one device, optionally logout from all others
await logoutAllOtherDevices(db, userId, currentDeviceToken);
```

### Example 5: Create API Endpoint to List Devices
```javascript
// GET /api/user/devices
const userDevices = async (req, res) => {
  try {
    const userId = req.user.id;
    const { getActiveDevices } = require('../utils/deviceTracking');

    const devices = await getActiveDevices(db, userId);

    res.json({
      status: true,
      data: devices.map(d => ({
        device_id: d.device_id,
        device_name: d.device_name,
        device_type: d.device_type,
        ip_address: d.ip_address,
        browser: `${d.browser_name} ${d.browser_version}`,
        os: `${d.os_name} ${d.os_version}`,
        last_login: d.last_login_at,
        login_count: d.login_count,
        is_current: d.device_token === req.deviceToken
      }))
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
```

### Example 6: Create API Endpoint to Logout a Device
```javascript
// POST /api/user/logout-device/:deviceId
const logoutUserDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;

    // Verify device belongs to user
    const device = await db.device_login.findOne({
      where: { id: deviceId, user_id: userId }
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const { logoutDevice } = require('../utils/deviceTracking');
    await logoutDevice(db, deviceId);

    res.json({
      status: true,
      message: 'Device logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
```

## Database Storage

Device login information is stored in **both** databases:
- **Main Database**: Central tracking of all user logins across the system
- **Tenant Database**: Isolated tracking for compliance/privacy requirements

### Querying Device Data

#### Get all devices for a user:
```javascript
const devices = await db.device_login.findAll({
  where: { user_id: userId },
  order: [['last_login_at', 'DESC']]
});
```

#### Get devices by IP address:
```javascript
const devices = await db.device_login.findAll({
  where: { ip_address: '192.168.1.100' }
});
```

#### Get devices by browser:
```javascript
const devices = await db.device_login.findAll({
  where: {
    user_id: userId,
    browser_name: 'Chrome'
  }
});
```

#### Get devices from specific OS:
```javascript
const devices = await db.device_login.findAll({
  where: {
    user_id: userId,
    os_name: 'Windows'
  }
});
```

#### Get suspicious logins (new devices):
```javascript
const newDevices = await db.device_login.findAll({
  where: {
    user_id: userId,
    login_count: 1
  }
});
```

## Security Considerations

1. **Device Token**: Each device gets a unique token that can be stored in JWT claims for additional verification
2. **IP Validation**: You can validate if logins from unusual IPs (e.g., different country)
3. **Device Anomalies**: Track and alert on:
   - New devices logging in
   - Simultaneous logins from different locations
   - Devices going inactive but suddenly becoming active again
4. **Session Management**: Use device_token in JWT to enforce device-specific sessions

## Next Steps

1. **Integrate with Login Controller**: Apply the same device tracking to your login/authentication endpoints
2. **Create Admin Dashboard**: Show device analytics and active sessions
3. **Implement Device Management UI**: Allow users to manage and revoke device access
4. **Add Geolocation**: Integrate IP geolocation service for location tracking
5. **Create Alerts**: Notify users of login from new devices or suspicious locations
6. **Device Fingerprinting**: Combine with additional fingerprinting for better device identification

## Notes

- The ModelDeviceLogin is automatically loaded in both main DB and tenant DB
- Device uniqueness is based on combination of IP, browser, and OS
- If a user logs in again from the same device, login_count increments and last_login_at updates
- IP extraction supports multiple proxy header formats (x-forwarded-for, x-real-ip, Cloudflare, etc.)
