// Device Detection and IP Extraction Utility

const parseUserAgent = (userAgent) => {
  if (!userAgent) {
    return {
      browser_name: 'Unknown',
      browser_version: 'Unknown',
      os_name: 'Unknown',
      os_version: 'Unknown',
      device_type: 'unknown'
    };
  }

  // Browser detection
  let browser_name = 'Unknown';
  let browser_version = 'Unknown';
  let os_name = 'Unknown';
  let os_version = 'Unknown';
  let device_type = 'unknown';

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Chromium')) {
    browser_name = 'Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    browser_version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser_name = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    browser_version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    browser_name = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    browser_version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Edge') || userAgent.includes('Edg')) {
    browser_name = 'Edge';
    const match = userAgent.match(/Edg[e]?\/([0-9.]+)/);
    browser_version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser_name = 'Opera';
    const match = userAgent.match(/OPR\/([0-9.]+)/);
    browser_version = match ? match[1] : 'Unknown';
  }

  // Detect OS
  if (userAgent.includes('Windows')) {
    os_name = 'Windows';
    if (userAgent.includes('Windows NT 10.0')) os_version = '10/11';
    else if (userAgent.includes('Windows NT 6.3')) os_version = '8.1';
    else if (userAgent.includes('Windows NT 6.2')) os_version = '8';
    else if (userAgent.includes('Windows NT 6.1')) os_version = '7';
  } else if (userAgent.includes('Macintosh') || userAgent.includes('Mac OS X')) {
    os_name = 'macOS';
    const match = userAgent.match(/Mac OS X ([0-9_.]+)/);
    os_version = match ? match[1].replace(/_/g, '.') : 'Unknown';
  } else if (userAgent.includes('Linux')) {
    os_name = 'Linux';
    if (userAgent.includes('Android')) {
      os_name = 'Android';
      const match = userAgent.match(/Android ([0-9.]+)/);
      os_version = match ? match[1] : 'Unknown';
    } else {
      os_version = 'Unknown';
    }
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os_name = 'iOS';
    const match = userAgent.match(/OS ([0-9_]+)/);
    os_version = match ? match[1].replace(/_/g, '.') : 'Unknown';
  }

  // Detect device type
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone') || userAgent.includes('webOS') || userAgent.includes('BlackBerry') || userAgent.includes('IEMobile') || userAgent.includes('Opera Mini')) {
    device_type = 'mobile';
  } else if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
    device_type = 'tablet';
  } else if (userAgent.includes('Windows') || userAgent.includes('Macintosh') || userAgent.includes('Linux')) {
    device_type = 'desktop';
  }

  return {
    browser_name,
    browser_version,
    os_name,
    os_version,
    device_type
  };
};

const getClientIP = (req) => {
  // Check for IP from different sources
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    // x-forwarded-for header can contain multiple IPs, use the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Other common proxy headers
  if (req.headers['x-client-ip']) {
    return req.headers['x-client-ip'];
  }

  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'];
  }

  if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip']; // Cloudflare
  }

  if (req.connection?.remoteAddress) {
    return req.connection.remoteAddress;
  }

  if (req.socket?.remoteAddress) {
    return req.socket.remoteAddress;
  }

  if (req.connection?.socket?.remoteAddress) {
    return req.connection.socket.remoteAddress;
  }

  return 'Unknown';
};

const captureDeviceDetails = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const ipAddress = getClientIP(req);
  const { browser_name, browser_version, os_name, os_version, device_type } = parseUserAgent(userAgent);

  // Generate a device name for easy identification
  const device_name = `${os_name} - ${browser_name}`;

  return {
    device_name,
    device_type,
    browser_name,
    browser_version,
    os_name,
    os_version,
    ip_address: ipAddress,
    user_agent: userAgent,
  };
};

const generateDeviceToken = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  parseUserAgent,
  getClientIP,
  captureDeviceDetails,
  generateDeviceToken
};
