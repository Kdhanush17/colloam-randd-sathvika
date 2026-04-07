const jwt = require('jsonwebtoken');
const env = require('../config/environment');
const logger = require('../utils/winston');

/**
 * Generate access and refresh tokens
 * @param {string} userCode - User code (superAdminCode, adminCode, or userCode)
 * @param {string} workspaceId - Workspace ID
 * @param {string} role - User role
 * @param {string} email - User email
 * @param {string} tenant_db - Tenant database name (optional, for multi-tenancy)
 * @returns {object} Access and refresh tokens
 */
function generateTokens(userCode, workspaceId, role = 'viewer', email = null, tenant_db = null) {
  try {
    const accessTokenPayload = {
      userCode,
      workspace_id: workspaceId,
      role,
      email,
      tenant_db,
      type: 'access',
    };

    const refreshTokenPayload = {
      userCode,
      workspace_id: workspaceId,
      type: 'refresh',
    };

    const accessToken = jwt.sign(accessTokenPayload, env.jwtKey, {
      expiresIn: env.expiresIn,
    });

    const refreshToken = jwt.sign(refreshTokenPayload, env.refreshSecret, {
      expiresIn: env.expiresIn,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: env.expiresIn,
    };
  } catch (error) {
    logger.error('Token generation error:', error);
    throw new Error('Failed to generate tokens');
  }
}

/**
 * Verify access token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.jwtKey);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired');
    }
    throw new Error('Invalid access token');
  }
}

/**
 * Verify refresh token
 * @param {string} token - Refresh token
 * @returns {object} Decoded token payload
 */
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, env.refreshSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    throw new Error('Invalid refresh token');
  }
}

/**
 * Decode token without verification (for reading payload)
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
function extractToken(authHeader) {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
}

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  extractToken,
};
