// User Status
const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
};

// Workspace Status
const WORKSPACE_STATUS = {
  ACTIVE: 'active',
  TRIAL_ENDED: 'trial_ended',
  SUSPENDED: 'suspended',
};

// Workspace Types
const WORKSPACE_TYPES = {
  INDIVIDUAL: 'individual',
  AGENCY: 'agency',
  PRODUCTION: 'production',
  BRAND: 'brand',
};

// Team Size
const TEAM_SIZE = {
  SOLO: 'solo',
  SMALL: 'small', // 3-4 members
  LARGE: 'large', // 10+
};

// Publishing Frequency
const PUBLISHING_FREQUENCY = {
  DAILY: 'daily',
  MULTIPLE_WEEKLY: '2-3x_week',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

// System Roles
const SYSTEM_ROLES = {
  SUPER_ADMIN:'super_admin',
  ADMIN: 'admin',
  CONTENT_MANAGER: 'content_manager',
  EDITOR: 'editor',
  SEO_MANAGER: 'seo_manager',
  VIEWER: 'viewer',
  CLIENT:'client',
};

// Workflow Roles (default)
const DEFAULT_WORKFLOW_ROLES = [
  'Content Manager',
  'Script Writer',
  'Editor',
  'SEO Manager',
  'Uploader',
  'Social Media Manager',
];

// Workflow Stages (default pipeline)
const DEFAULT_WORKFLOW_STAGES = [
  'Idea',
  'Script',
  'Shoot',
  'Edit',
  'Upload',
  'SEO',
  'Publish',
  'Revenue',
];

// Content Types
const CONTENT_TYPES = {
  VIDEO: 'video',
  ARTICLE: 'article',
  POST: 'post',
  IMAGE: 'image',
  PODCAST: 'podcast',
  DOCUMENT: 'document',
};

// Priority Levels
const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Task Status
const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
};

// Subscription Plans
const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  TEAM: 'team',
  BUSINESS: 'business',
  ENTERPRISE: 'enterprise',
};

// Billing Cycles
const BILLING_CYCLE = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

// Notification Types
const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  DEADLINE_APPROACHING: 'deadline_approaching',
  APPROVAL_NEEDED: 'approval_needed',
  TEAM_UPDATE: 'team_update',
  STORAGE_WARNING: 'storage_warning',
  TRIAL_EXPIRING: 'trial_expiring',
  TEAM_MEMBER_ADDED: 'team_member_added',
  CONTENT_STAGE_CHANGED: 'content_stage_changed',
  WORKSPACE_SUSPENDED: 'workspace_suspended',
  PAYMENT_FAILED: 'payment_failed',
};

// Notification Preferences
const NOTIFICATION_PREFERENCES = {
  EMAIL_ONLY: 'email_only',
  IN_APP_ONLY: 'in_app_only',
  BOTH: 'both',
  NONE: 'none',
};

// Activity Log Actions
const ACTIVITY_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read',
  MOVE: 'move',
  ASSIGN: 'assign',
  INVITE: 'invite',
  REMOVE: 'remove',
  APPROVE: 'approve',
  REJECT: 'reject',
};

// Permissions
const PERMISSIONS = {
  // Content
  'content:create': 'Create content',
  'content:read': 'Read content',
  'content:update': 'Update content',
  'content:delete': 'Delete content',
  'content:move': 'Move content between stages',

  // Tasks
  'task:create': 'Create tasks',
  'task:read': 'Read tasks',
  'task:update': 'Update tasks',
  'task:delete': 'Delete tasks',
  'task:assign': 'Assign tasks',

  // Team
  'team:invite': 'Invite team members',
  'team:manage': 'Manage team members',
  'team:remove': 'Remove team members',
  'team:edit-roles': 'Edit team member roles',

  // Workspace
  'workspace:settings': 'Manage workspace settings',
  'workspace:delete': 'Delete workspace',

  // Storage
  'storage:upload': 'Upload files',
  'storage:delete': 'Delete files',
  'storage:manage': 'Manage storage',

  // Billing
  'billing:view': 'View billing information',
  'billing:manage': 'Manage billing',
  'billing:upgrade': 'Upgrade plan',

  // Analytics
  'analytics:view': 'View analytics',
  'analytics:export': 'Export reports',
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Codes
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  STORAGE_LIMIT_EXCEEDED: 'STORAGE_LIMIT_EXCEEDED',
  TRIAL_ENDED: 'TRIAL_ENDED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

module.exports = {
  USER_STATUS,
  WORKSPACE_STATUS,
  WORKSPACE_TYPES,
  TEAM_SIZE,
  PUBLISHING_FREQUENCY,
  SYSTEM_ROLES,
  DEFAULT_WORKFLOW_ROLES,
  DEFAULT_WORKFLOW_STAGES,
  CONTENT_TYPES,
  PRIORITY_LEVELS,
  TASK_STATUS,
  SUBSCRIPTION_PLANS,
  BILLING_CYCLE,
  NOTIFICATION_TYPES,
  NOTIFICATION_PREFERENCES,
  ACTIVITY_ACTIONS,
  PERMISSIONS,
  HTTP_STATUS,
  ERROR_CODES,
};
