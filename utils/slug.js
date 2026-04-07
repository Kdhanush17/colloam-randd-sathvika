const { v4: uuidv4 } = require('uuid');

/**
 * Generate URL-friendly slug from string
 * @param {string} str - String to convert to slug
 * @returns {string} URL-friendly slug
 */
function generateSlug(str) {
  if (!str) return '';

  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50); // Max 50 characters
}

/**
 * Generate unique slug by appending UUID suffix if duplicate
 * @param {string} baseSlug - Base slug
 * @param {number} attempt - Attempt number (for recursion)
 * @returns {string} Unique slug
 */
function generateUniqueSlug(baseSlug, attempt = 0) {
  if (attempt === 0) {
    return baseSlug;
  }

  const suffix = uuidv4().substring(0, 8);
  return `${baseSlug}-${suffix}`;
}

/**
 * Validate slug format
 * @param {string} slug - Slug to validate
 * @returns {object} Validation result
 */
function validateSlug(slug) {
  const errors = [];

  if (!slug || slug.length === 0) {
    errors.push('Slug is required');
  }

  if (slug.length < 3) {
    errors.push('Slug must be at least 3 characters long');
  }

  if (slug.length > 50) {
    errors.push('Slug must not exceed 50 characters');
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
  }

  if (/^-|-$/.test(slug)) {
    errors.push('Slug cannot start or end with a hyphen');
  }

  // Reserved slugs
  const reserved = [
    'api',
    'admin',
    'dashboard',
    'auth',
    'login',
    'signup',
    'register',
    'settings',
    'profile',
    'help',
    'contact',
    'about',
    'terms',
    'privacy',
    'www',
  ];

  if (reserved.includes(slug)) {
    errors.push(`'${slug}' is a reserved slug`);
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

module.exports = {
  generateSlug,
  generateUniqueSlug,
  validateSlug,
};
