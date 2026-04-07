# CreatorOps - Backend Architecture & API Plan

## 📚 Tech Stack Overview

### Backend Technologies
```
├─ Runtime: Node.js (v18+ or v20+)
├─ Framework: Express.js 4.x
├─ Language: JavaScript (ES6+)
├─ Database: PostgreSQL 14+
├─ ORM/Query Builder: Sequelize or Prisma
├─ Authentication: JWT (jsonwebtoken) + bcrypt
├─ File Storage: AWS S3
├─ Cache: Redis (optional, for performance)
├─ Job Queue: Bull or Bee-Queue (for async tasks)
├─ Email: SendGrid or Nodemailer
├─ Validation: Joi or Express-validator
├─ Logger: Winston or Morgan
└─ Testing: Jest, Supertest
```

### Frontend Technologies
```
├─ Web: React 18.x + Next.js (optional)
├─ Mobile: React Native (for iOS/Android)
├─ State Management: Redux Toolkit or Zustand
├─ HTTP Client: Axios
├─ UI Components: Material-UI, React Native Paper, or custom
└─ Build Tool: Webpack (via Create React App) or Vite
```

### Infrastructure & DevOps
```
├─ Hosting: AWS EC2 or Heroku
├─ Database Hosting: AWS RDS or Digital Ocean
├─ Container: Docker + Docker Compose
├─ CI/CD: GitHub Actions or GitLab CI
├─ Monitoring: Datadog or New Relic
├─ Logging: Winston or Morgan
├─ Error Tracking: Sentry
└─ Load Balancer: AWS ALB or Nginx
```

---

## 🏗️ Backend Folder Structure

```
creatorops-backend/
├── src/
│   ├── config/                    # Configuration files
│   │   ├── database.js           # PostgreSQL connection
│   │   ├── aws.js                # AWS S3 configuration
│   │   ├── email.js              # Email service config
│   │   ├── jwt.js                # JWT configuration
│   │   └── env.js                # Environment variables validation
│   │
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── workspaces.controller.js
│   │   ├── content.controller.js
│   │   ├── tasks.controller.js
│   │   ├── teams.controller.js
│   │   ├── storage.controller.js
│   │   ├── billing.controller.js
│   │   └── analytics.controller.js
│   │
│   ├── services/                 # Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── workspace.service.js
│   │   ├── content.service.js
│   │   ├── task.service.js
│   │   ├── team.service.js
│   │   ├── storage.service.js
│   │   ├── file.service.js
│   │   ├── s3.service.js
│   │   ├── email.service.js
│   │   ├── billing.service.js
│   │   └── analytics.service.js
│   │
│   ├── models/                   # Database models/entities
│   │   ├── User.js
│   │   ├── Workspace.js
│   │   ├── Brand.js
│   │   ├── TeamMember.js
│   │   ├── Role.js
│   │   ├── Permission.js
│   │   ├── Content.js
│   │   ├── Task.js
│   │   ├── WorkflowRole.js
│   │   ├── WorkflowStage.js
│   │   ├── Storage.js
│   │   ├── Subscription.js
│   │   ├── Notification.js
│   │   └── ActivityLog.js
│   │
│   ├── routes/                   # API routes
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── workspaces.routes.js
│   │   ├── content.routes.js
│   │   ├── tasks.routes.js
│   │   ├── teams.routes.js
│   │   ├── storage.routes.js
│   │   ├── billing.routes.js
│   │   ├── analytics.routes.js
│   │   └── index.js              # Route aggregator
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── cors.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   ├── requestLogger.middleware.js
│   │   └── multitenancy.middleware.js
│   │
│   ├── utils/                    # Utility functions
│   │   ├── logger.js
│   │   ├── errors.js             # Custom error classes
│   │   ├── validators.js
│   │   ├── jwt.utils.js
│   │   ├── password.utils.js
│   │   ├── response.utils.js
│   │   ├── storage.utils.js
│   │   └── email.utils.js
│   │
│   ├── migrations/               # Database migrations
│   │   ├── 001_create_users_table.js
│   │   ├── 002_create_workspaces_table.js
│   │   ├── 003_create_content_table.js
│   │   └── [...].js
│   │
│   ├── seeders/                  # Database seeders
│   │   ├── seed.users.js
│   │   ├── seed.roles.js
│   │   └── index.js
│   │
│   ├── constants/                # Application constants
│   │   ├── http-status.js
│   │   ├── permissions.js
│   │   ├── roles.js
│   │   ├── storage.js
│   │   └── errors.js
│   │
│   ├── jobs/                     # Async job processing
│   │   ├── email.jobs.js
│   │   ├── storage.jobs.js
│   │   ├── notification.jobs.js
│   │   └── index.js
│   │
│   └── app.js                    # Express app initialization
│
├── tests/                        # Test files (mirror src structure)
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── .env.example                  # Environment template
├── .dockerignore
├── docker-compose.yml            # Local development environment
├── Dockerfile
├── package.json
├── .eslintrc.js                  # ESLint configuration
└── README.md
```

---

## 🗄️ Complete Database Schema

### Table: users
```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  profile_picture_url VARCHAR(500),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_token_expires_at TIMESTAMP,
  password_reset_token VARCHAR(255),
  password_reset_token_expires_at TIMESTAMP,
  last_login_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active', -- active, suspended, deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

### Table: workspaces
```sql
CREATE TABLE workspaces (
  workspace_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, -- subdomain identifier
  workspace_type VARCHAR(50) NOT NULL, -- individual, agency, production, brand
  team_size VARCHAR(50), -- solo, small, large
  publishing_frequency VARCHAR(50), -- daily, 2-3x_week, weekly, monthly
  timezone VARCHAR(50) DEFAULT 'UTC',
  logo_url VARCHAR(500),
  description TEXT,
  website_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active', -- active, trial_ended, suspended
  trial_started_at TIMESTAMP,
  trial_expires_at TIMESTAMP,
  trial_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);
CREATE INDEX idx_workspaces_status ON workspaces(status);
```

### Table: brands
```sql
CREATE TABLE brands (
  brand_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  industry VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_brands_workspace_id ON brands(workspace_id);
CREATE UNIQUE INDEX idx_brands_workspace_default ON brands(workspace_id) WHERE is_default = TRUE;
```

### Table: roles
```sql
CREATE TABLE roles (
  role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE, -- Cannot be deleted if true
  permissions JSONB DEFAULT '{}', -- Stores array of permission keys
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roles_workspace_id ON roles(workspace_id);
CREATE UNIQUE INDEX idx_roles_workspace_name ON roles(workspace_id, name);
```

### Table: team_members
```sql
CREATE TABLE team_members (
  member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT,
  email VARCHAR(255), -- Email for invited users not yet registered
  status VARCHAR(50) DEFAULT 'active', -- active, invited, inactive, removed
  invited_by UUID REFERENCES users(user_id),
  invited_at TIMESTAMP,
  joined_at TIMESTAMP,
  removed_at TIMESTAMP,
  last_activity_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_team_members_workspace_id ON team_members(workspace_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_status ON team_members(status);
```

### Table: workflow_roles
```sql
CREATE TABLE workflow_roles (
  workflow_role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- icon identifier
  is_system BOOLEAN DEFAULT TRUE, -- System roles: Content Manager, Script Writer, etc.
  is_custom BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflow_roles_workspace_id ON workflow_roles(workspace_id);
```

### Table: workflow_stages
```sql
CREATE TABLE workflow_stages (
  stage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  order_index INT NOT NULL,
  is_system BOOLEAN DEFAULT TRUE, -- System stages: Idea, Script, Shoot, etc.
  is_custom BOOLEAN DEFAULT FALSE,
  is_final_stage BOOLEAN DEFAULT FALSE, -- Revenue stage
  duration_days INT, -- Expected duration in days (optional)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflow_stages_workspace_id ON workflow_stages(workspace_id);
CREATE UNIQUE INDEX idx_workflow_stages_workspace_order ON workflow_stages(workspace_id, order_index);
```

### Table: content
```sql
CREATE TABLE content (
  content_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(brand_id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content_type VARCHAR(100), -- video, article, post, image, podcast, etc.
  current_stage_id UUID NOT NULL REFERENCES workflow_stages(stage_id),
  status VARCHAR(50) DEFAULT 'draft', -- draft, in_progress, completed, archived
  priority VARCHAR(20) DEFAULT 'medium', -- high, medium, low
  assigned_to UUID REFERENCES team_members(member_id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES team_members(member_id) ON DELETE RESTRICT,
  due_date DATE,
  publish_date DATE,
  thumbnail_url VARCHAR(500),
  revenue DECIMAL(10, 2) DEFAULT 0.00,
  revenue_source VARCHAR(100), -- youtube, tiktok, sponsor, etc.
  tags JSONB DEFAULT '{}', -- Array of tags
  metadata JSONB DEFAULT '{}', -- Custom metadata
  parent_content_id UUID REFERENCES content(content_id), -- For series/parts
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  moved_to_stage_at TIMESTAMP,
  completed_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_content_workspace_id ON content(workspace_id);
CREATE INDEX idx_content_brand_id ON content(brand_id);
CREATE INDEX idx_content_stage_id ON content(current_stage_id);
CREATE INDEX idx_content_assigned_to ON content(assigned_to);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_created_by ON content(created_by);
```

### Table: tasks
```sql
CREATE TABLE tasks (
  task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(content_id) ON DELETE CASCADE,
  project_id UUID, -- Future: for organizing tasks by project
  title VARCHAR(500) NOT NULL,
  description TEXT,
  assigned_to UUID NOT NULL REFERENCES team_members(member_id) ON DELETE RESTRICT,
  created_by UUID NOT NULL REFERENCES team_members(member_id) ON DELETE RESTRICT,
  due_date DATE,
  priority VARCHAR(20) DEFAULT 'medium', -- high, medium, low
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, blocked
  tags JSONB DEFAULT '{}',
  estimated_hours INT,
  actual_hours INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_tasks_workspace_id ON tasks(workspace_id);
CREATE INDEX idx_tasks_content_id ON tasks(content_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
```

### Table: content_stages_history
```sql
CREATE TABLE content_stages_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content(content_id) ON DELETE CASCADE,
  from_stage_id UUID REFERENCES workflow_stages(stage_id),
  to_stage_id UUID NOT NULL REFERENCES workflow_stages(stage_id),
  moved_by UUID NOT NULL REFERENCES team_members(member_id),
  notes TEXT,
  duration_in_stage INT, -- Duration in seconds
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_stages_history_content_id ON content_stages_history(content_id);
```

### Table: task_comments
```sql
CREATE TABLE task_comments (
  comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content(content_id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(task_id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES team_members(member_id) ON DELETE RESTRICT,
  comment_text TEXT NOT NULL,
  mentions JSONB DEFAULT '{}', -- Array of mentioned user IDs
  attachments JSONB DEFAULT '{}', -- Array of attachment URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_task_comments_content_id ON task_comments(content_id);
CREATE INDEX idx_task_comments_author_id ON task_comments(author_id);
```

### Table: storage
```sql
CREATE TABLE storage (
  storage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES team_members(member_id) ON DELETE SET NULL,
  file_name VARCHAR(500) NOT NULL,
  file_type VARCHAR(50), -- image, video, document, audio, etc.
  file_extension VARCHAR(10),
  file_size_bytes BIGINT NOT NULL,
  mime_type VARCHAR(100),
  s3_key VARCHAR(1000) NOT NULL UNIQUE, -- Full S3 path
  s3_url VARCHAR(1000) NOT NULL,
  thumbnail_url VARCHAR(1000),
  is_public BOOLEAN DEFAULT FALSE,
  content_id UUID REFERENCES content(content_id) ON DELETE SET NULL,
  storage_path_metadata JSONB, -- For organizing files
  virus_scan_status VARCHAR(50) DEFAULT 'pending', -- pending, clean, infected
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_storage_workspace_id ON storage(workspace_id);
CREATE INDEX idx_storage_content_id ON storage(content_id);
CREATE INDEX idx_storage_s3_key ON storage(s3_key);
```

### Table: subscriptions
```sql
CREATE TABLE subscriptions (
  subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL UNIQUE REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL DEFAULT 'free', -- free, starter, team, business, enterprise
  status VARCHAR(50) DEFAULT 'active', -- active, cancelled, expired, suspended
  billing_cycle VARCHAR(20), -- monthly, yearly
  price DECIMAL(10, 2),
  storage_limit_gb INT,
  team_member_limit INT,
  brand_limit INT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  payment_method_id VARCHAR(255), -- Stripe payment method ID (if applicable)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP
);

CREATE INDEX idx_subscriptions_workspace_id ON subscriptions(workspace_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Table: storage_usage
```sql
CREATE TABLE storage_usage (
  usage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  total_used_bytes BIGINT DEFAULT 0,
  file_count INT DEFAULT 0,
  storage_limit_bytes BIGINT,
  last_calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_storage_usage_workspace_id ON storage_usage(workspace_id);
```

### Table: notifications
```sql
CREATE TABLE notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES team_members(member_id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- task_assigned, content_moved, comment_mentioned, deadline_alert, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_entity_id UUID, -- content_id, task_id, etc.
  related_entity_type VARCHAR(50), -- content, task, etc.
  is_read BOOLEAN DEFAULT FALSE,
  channel VARCHAR(50), -- email, in_app, both
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

### Table: activity_logs
```sql
CREATE TABLE activity_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
  user_id UUID REFERENCES team_members(member_id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- created_content, updated_content, moved_content, etc.
  entity_type VARCHAR(50), -- content, task, user, etc.
  entity_id UUID,
  changes JSONB, -- Before/after values
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_workspace_id ON activity_logs(workspace_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user_id_uuid",
  "workspace_id": "workspace_uuid",
  "role": "admin",
  "permissions": ["content:create", "content:edit", "team:manage"],
  "iat": 1627649000,
  "exp": 1627735400,
  "type": "access"
}
```

### Permission System
```javascript
// System Permissions
const PERMISSIONS = {
  // Content Permissions
  CONTENT_CREATE: 'content:create',
  CONTENT_READ: 'content:read',
  CONTENT_UPDATE: 'content:update',
  CONTENT_DELETE: 'content:delete',

  // Task Permissions
  TASK_CREATE: 'task:create',
  TASK_READ: 'task:read',
  TASK_UPDATE: 'task:update',
  TASK_DELETE: 'task:delete',

  // Team Permissions
  TEAM_MANAGE: 'team:manage',
  TEAM_INVITE: 'team:invite',
  TEAM_REMOVE: 'team:remove',

  // Finance Permissions
  REVENUE_VIEW: 'revenue:view',
  COSTS_VIEW: 'costs:view',

  // Settings Permissions
  SETTINGS_MANAGE: 'settings:manage',
  BILLING_MANAGE: 'billing:manage'
};

// Default Roles & Permissions
const DEFAULT_ROLES = {
  ADMIN: {
    name: 'Admin',
    description: 'Full workspace access',
    permissions: ['*'] // All permissions
  },
  CONTENT_MANAGER: {
    name: 'Content Manager',
    description: 'Manage content and workflow',
    permissions: [
      'content:create', 'content:read', 'content:update', 'content:delete',
      'task:create', 'task:read', 'task:update',
      'revenue:view'
    ]
  },
  EDITOR: {
    name: 'Editor',
    description: 'Edit and manage content',
    permissions: [
      'content:read', 'content:update',
      'task:read', 'task:update'
    ]
  },
  SEO_MANAGER: {
    name: 'SEO Manager',
    description: 'Handle SEO optimization',
    permissions: [
      'content:read', 'content:update',
      'task:read', 'task:update'
    ]
  },
  VIEWER: {
    name: 'Viewer',
    description: 'Read-only access',
    permissions: [
      'content:read',
      'task:read',
      'revenue:view'
    ]
  }
};
```

---

## 🛣️ API Endpoint Structure

### Base URL
```
https://api.creatorops.com/v1
or
https://{workspace}.creatorops.com/api/v1 (multi-tenant)
```

### Authentication Endpoints

```http
POST /auth/register
Body: {
  email: string,
  password: string,
  full_name: string,
  workspace_name: string,
  workspace_slug: string
}
Response: { user, workspace, access_token, refresh_token }

POST /auth/login
Body: { email, password }
Response: { user, workspace, access_token, refresh_token }

POST /auth/refresh
Body: { refresh_token }
Response: { access_token }

POST /auth/logout
Header: Authorization: Bearer {token}
Response: { success: true }

POST /auth/forgot-password
Body: { email }
Response: { message: "Reset link sent" }

POST /auth/reset-password
Body: { token, new_password }
Response: { success: true }

POST /auth/verify-email
Query: token={verification_token}
Response: { success: true }
```

### User Endpoints

```http
GET /users/me
Response: { user object }

PUT /users/me
Body: { full_name, profile_picture_url, timezone, notification_preferences }
Response: { updated user }

PUT /users/me/password
Body: { current_password, new_password }
Response: { success: true }

GET /users/{user_id}
Response: { user object (public info) }

DELETE /users/me
Body: { password }
Response: { success: true }
```

### Workspace Endpoints

```http
GET /workspaces
Response: { workspaces: [...] }

POST /workspaces
Body: { name, slug, workspace_type, ... }
Response: { workspace }

GET /workspaces/{workspace_id}
Response: { workspace object with subscription info }

PUT /workspaces/{workspace_id}
Body: { name, description, logo_url, ... }
Response: { updated workspace }

DELETE /workspaces/{workspace_id}
Body: { confirmation_password }
Response: { success: true }

POST /workspaces/{workspace_id}/onboarding
Body: { type, team_size, workflow_roles, workflow_stages, publishing_frequency, notification_preferences }
Response: { workspace with onboarding completed }
```

### Content Endpoints

```http
GET /workspaces/{workspace_id}/content
Query: stage={stage_id}, status={status}, assigned_to={user_id}, priority={priority}, page={page}, limit={limit}
Response: { content: [...], pagination }

POST /workspaces/{workspace_id}/content
Body: { title, description, content_type, brand_id, priority, assigned_to, due_date, tags }
Response: { content object }

GET /workspaces/{workspace_id}/content/{content_id}
Response: { content object with full details }

PUT /workspaces/{workspace_id}/content/{content_id}
Body: { title, description, priority, assigned_to, due_date, ... }
Response: { updated content }

PATCH /workspaces/{workspace_id}/content/{content_id}/stage
Body: { stage_id }
Response: { updated content with stage history }

DELETE /workspaces/{workspace_id}/content/{content_id}
Response: { success: true }

GET /workspaces/{workspace_id}/content/{content_id}/history
Response: { stage_history: [...] }

GET /workspaces/{workspace_id}/content/{content_id}/comments
Query: page={page}, limit={limit}
Response: { comments: [...] }

POST /workspaces/{workspace_id}/content/{content_id}/comments
Body: { comment_text, mentions, attachments }
Response: { comment object }
```

### Task Endpoints

```http
GET /workspaces/{workspace_id}/tasks
Query: assigned_to={user_id}, status={status}, priority={priority}, page={page}, limit={limit}
Response: { tasks: [...], pagination }

POST /workspaces/{workspace_id}/tasks
Body: { title, description, assigned_to, content_id, priority, due_date, estimated_hours }
Response: { task object }

GET /workspaces/{workspace_id}/tasks/{task_id}
Response: { task object }

PUT /workspaces/{workspace_id}/tasks/{task_id}
Body: { title, description, assigned_to, priority, status, due_date }
Response: { updated task }

PATCH /workspaces/{workspace_id}/tasks/{task_id}/status
Body: { status }
Response: { updated task }

DELETE /workspaces/{workspace_id}/tasks/{task_id}
Response: { success: true }
```

### Team Endpoints

```http
GET /workspaces/{workspace_id}/team
Response: { team_members: [...] }

POST /workspaces/{workspace_id}/team/invite
Body: { email, role_id }
Response: { invitation, sent_email: true }

GET /workspaces/{workspace_id}/team/{member_id}
Response: { team_member }

PUT /workspaces/{workspace_id}/team/{member_id}
Body: { role_id, status }
Response: { updated member }

DELETE /workspaces/{workspace_id}/team/{member_id}
Response: { success: true }

POST /workspaces/{workspace_id}/team/bulk-invite
Body: { emails: [...], role_id }
Response: { invitations: [...] }

GET /workspaces/{workspace_id}/roles
Response: { roles: [...] }

POST /workspaces/{workspace_id}/roles
Body: { name, description, permissions: [...] }
Response: { role }

PUT /workspaces/{workspace_id}/roles/{role_id}
Body: { name, description, permissions }
Response: { updated role }

DELETE /workspaces/{workspace_id}/roles/{role_id}
Response: { success: true }
```

### Storage Endpoints

```http
GET /workspaces/{workspace_id}/storage
Query: page={page}, limit={limit}
Response: { files: [...], usage: {...}, pagination }

POST /workspaces/{workspace_id}/storage/upload
Body: FormData { file, content_id (optional) }
Response: { file object, s3_url }

GET /workspaces/{workspace_id}/storage/{storage_id}
Response: { file object }

DELETE /workspaces/{workspace_id}/storage/{storage_id}
Response: { success: true, freed_space_bytes }

GET /workspaces/{workspace_id}/storage/usage
Response: { used_bytes, limit_bytes, file_count, percentage_used }

POST /workspaces/{workspace_id}/storage/generate-upload-signed-url
Body: { file_name, file_type, file_size }
Response: { signed_url, s3_key }
```

### Analytics Endpoints

```http
GET /workspaces/{workspace_id}/analytics/dashboard
Query: date_from={date}, date_to={date}
Response: {
  pipeline: { by_stage: {...} },
  content_created_count,
  average_stage_duration,
  team_metrics: {...}
}

GET /workspaces/{workspace_id}/analytics/revenue
Query: period={month|year}, date_from={date}, date_to={date}
Response: {
  total_revenue,
  revenue_by_content: [...],
  revenue_by_source: [...],
  trends: [...]
}

GET /workspaces/{workspace_id}/analytics/costs
Query: period={month|year}, date_from={date}, date_to={date}
Response: {
  total_costs,
  costs_by_category: [...],
  cost_vs_revenue: {...}
}

GET /workspaces/{workspace_id}/analytics/team
Response: {
  team_members: [...],
  tasks_by_member: {...},
  productivity_metrics: {...}
}
```

### Billing Endpoints

```http
GET /workspaces/{workspace_id}/subscription
Response: { subscription object with plan details }

POST /workspaces/{workspace_id}/subscription/upgrade
Body: { plan_type, billing_cycle }
Response: { updated subscription, payment_url (if needed) }

POST /workspaces/{workspace_id}/subscription/add-storage
Body: { additional_gb }
Response: { new_storage_limit, charge_amount}

GET /workspaces/{workspace_id}/billing/invoices
Query: page={page}, limit={limit}
Response: { invoices: [...], pagination }

GET /workspaces/{workspace_id}/billing/invoices/{invoice_id}
Response: { invoice object }

POST /workspaces/{workspace_id}/billing/payment-method
Body: { payment_method_id, set_as_default }
Response: { success: true }
```

---

## 🧑‍💼 Service Layer Architecture

### Auth Service
```javascript
class AuthService {
  async register(email, password, fullName, workspaceName) {
    // Hash password, create user, create workspace, send verification email
    // Return User object
  }

  async login(email, password) {
    // Verify credentials
    // Generate JWT tokens
    // Return { user, tokens }
  }

  async validateToken(token) {
    // Verify JWT signature, check expiration
    // Return TokenPayload
  }

  async refreshToken(refreshToken) {
    // Verify refresh token
    // Generate new access token
    // Return { accessToken }
  }

  async logout(userId) {
    // Invalidate token (optional: add to blacklist)
  }

  async forgotPassword(email) {
    // Generate reset token
    // Send reset email
  }

  async resetPassword(token, newPassword) {
    // Verify token, hash new password
    // Update user password
  }

  async verifyEmail(token) {
    // Verify email token
    // Mark user email as verified
  }

  async enableTwoFactor(userId) {
    // Generate secret
    // Return QR code
  }
}
```

### Workspace Service
```javascript
class WorkspaceService {
  async createWorkspace(ownerId, data) {
    // Create workspace with unique slug
    // Create default subscription (free trial)
    // Create default roles and workflow stages
    // Return Workspace
  }

  async getWorkspace(workspaceId) {
    // Fetch workspace with related data
    // Return Workspace
  }

  async updateWorkspace(workspaceId, data) {
    // Update workspace details
    // Return updated Workspace
  }

  async completeOnboarding(workspaceId, data) {
    // Save onboarding preferences
    // Create custom workflow roles/stages
    // Return updated Workspace
  }

  async deleteWorkspace(workspaceId) {
    // Soft delete workspace
    // Cascade delete related data
  }

  async checkSlugAvailability(slug) {
    // Check if slug is available
    // Return boolean
  }

  async getWorkspacesByUser(userId) {
    // Get all workspaces for user
    // Return Workspace[]
  }
}
```

### Content Service
```javascript
class ContentService {
  async createContent(workspaceId, data) {
    // Create content record
    // Assign to initial workflow stage
    // Return Content
  }

  async getContent(workspaceId, contentId) {
    // Fetch content with relationships
    // Return Content
  }

  async updateContent(workspaceId, contentId, data) {
    // Update content fields
    // Return updated Content
  }

  async moveToStage(workspaceId, contentId, stageId) {
    // Move content to new stage
    // Record stage history
    // Send notifications
    // Return updated Content
  }

  async deleteContent(workspaceId, contentId) {
    // Soft delete content
  }

  async listContent(workspaceId, filters, pagination) {
    // Apply filters, pagination
    // Return { content, pagination }
  }

  async getContentHistory(workspaceId, contentId) {
    // Return stage transition history
    // Return StageHistory[]
  }
}
```

### Storage Service & S3 Integration
```javascript
class StorageService {
  async uploadFile(workspaceId, file, contentId) {
    // Check storage limit
    // Upload to S3
    // Create storage record
    // Update storage usage
    // Return StorageObject
  }

  async generateSignedUploadUrl(workspaceId, fileName, fileSize) {
    // Check storage limit
    // Generate S3 presigned URL
    // Return { url, s3Key }
  }

  async deleteFile(workspaceId, storageId) {
    // Delete from S3
    // Delete storage record
    // Update storage usage
  }

  async getStorageUsage(workspaceId) {
    // Calculate total storage used
    // Return { usedBytes, limitBytes }
  }

  async enforceStorageLimit(workspaceId) {
    // Check if workspace exceeded limit
    // Block new uploads if exceeded
  }

  async getFiles(workspaceId, pagination) {
    // List files with pagination
    // Return { files, pagination }
  }
}

class S3Service {
  async uploadFile(buffer, key) {
    // Upload to S3
    // Return { url, key }
  }

  async deleteFile(key) {
    // Delete from S3
  }

  async getSignedUrl(key, expiresIn) {
    // Generate signed download URL
    // Return string (URL)
  }

  async generateUploadSignedUrl(key, expiresIn) {
    // Generate signed upload URL
    // Return string (URL)
  }

  async listFiles(prefix, limit) {
    // List files with prefix
    // Return { ... }
  }

  async getFileSizeStats(workspaceId) {
    // Get total size of all files
    // Return { totalBytes }
  }
}
```

### Notification Service
```javascript
class NotificationService {
  async sendNotification(workspaceId, userId, type, data) {
    // Create notification record
    // Send via appropriate channel (email/in-app)
    // Return Notification
  }

  async sendEmailNotification(email, subject, template, data) {
    // Render email template
    // Send via email provider
  }

  async getUserNotifications(userId, unreadOnly) {
    // Fetch user notifications
    // Filter unread if specified
    // Return Notification[]
  }

  async markAsRead(notificationId) {
    // Mark notification as read
  }
}
```

### Team & Permission Service
```javascript
class TeamService {
  async inviteUser(workspaceId, email, roleId) {
    // Create invitation
    // Send invitation email
    // Return Invitation
  }

  async addTeamMember(workspaceId, userId, roleId) {
    // Add existing user as team member
    // Return TeamMember
  }

  async updateMemberRole(workspaceId, memberId, roleId) {
    // Update team member role
    // Return updated TeamMember
  }

  async removeTeamMember(workspaceId, memberId) {
    // Soft delete team member
  }

  async getTeamMembers(workspaceId) {
    // Fetch all team members
    // Return TeamMember[]
  }
}

class PermissionService {
  async hasPermission(userId, workspaceId, permission) {
    // Get user role
    // Check if role has permission
    // Return boolean
  }

  async checkPermissions(userId, workspaceId, permissions) {
    // Check multiple permissions
    // Return boolean (all must be true)
  }

  async getRolePermissions(roleId) {
    // Get all permissions for role
    // Return Permission[]
  }

  async updateRolePermissions(roleId, permissions) {
    // Update role permissions
    // Return updated Role
  }
}
```

### Billing Service
```javascript
class BillingService {
  async getSubscription(workspaceId) {
    // Fetch subscription
    // Return Subscription
  }

  async createFreeTrial(workspaceId) {
    // Create free trial subscription
    // Set expiration (7 days)
    // Return Subscription
  }

  async upgradePlan(workspaceId, planType, billingCycle) {
    // Update subscription
    // Process payment (if applicable)
    // Return updated Subscription
  }

  async addStorage(workspaceId, additionalGb) {
    // Calculate cost
    // Process payment
    // Update storage limit
    // Return updated Subscription
  }

  async calculateStorageCost(additionalGb, planType) {
    // Calculate cost based on plan pricing
    // Return number (cost)
  }

  async checkTrialExpiration(workspaceId) {
    // Check if trial expired
    // Return boolean
  }

  async enforceTrialLimitations(workspaceId) {
    // Apply trial limitations (user/brand/storage limits)
  }
}
```

---

## 🔒 Free Tier Storage Limitations

### Storage Enforcement Logic

```javascript
class StorageLimitEnforcer {
  async checkStorageLimit(workspaceId, fileSize) {
    const subscription = await Subscription.findByWorkspaceId(workspaceId);
    const usage = await StorageUsage.findByWorkspaceId(workspaceId);

    const totalAfterUpload = usage.total_used_bytes + fileSize;
    const limitInBytes = subscription.storage_limit_gb * 1024 * 1024 * 1024;

    if (subscription.plan_type === 'free') {
      // Free tier: 5GB limit, no upgrades
      const freeLimit = 5 * 1024 * 1024 * 1024;
      return {
        allowed: totalAfterUpload <= freeLimit,
        reason: totalAfterUpload > freeLimit ? 'Storage limit exceeded' : null
      };
    }

    return {
      allowed: totalAfterUpload <= limitInBytes,
      reason: totalAfterUpload > limitInBytes ? 'Storage limit exceeded' : null
    };
  }

  async preventOperationsIfLimitExceeded(workspaceId) {
    const subscription = await Subscription.findByWorkspaceId(workspaceId);
    const usage = await StorageUsage.findByWorkspaceId(workspaceId);

    const percentage = (usage.total_used_bytes / (subscription.storage_limit_gb * 1024 * 1024 * 1024)) * 100;

    if (percentage >= 100) {
      // Block new uploads
      // Notify user
      // Mark workspace as needing upgrade
    } else if (percentage >= 90) {
      // Warn user
      // Send notification
    }
  }
}
```

---

## 📋 Middleware Stack

```javascript
// app.js
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);
app.use(rateLimiter);
app.use(multitenancyDetector); // Extract workspace from subdomain/header

app.use('/auth', authRoutes);
app.use('/api/v1', authMiddleware, multitenancyMiddleware, routes);

app.use(errorHandler);
```

---

## 🧪 Testing Strategy

### Test Types
```
Unit Tests:
- Service layer logic
- Utility functions
- Validation logic

Integration Tests:
- API endpoints
- Database operations
- Auth flow
- Storage operations

E2E Tests:
- Complete user workflows
- Multi-step operations
```

### Test Structure
```bash
tests/
├── unit/
│   ├── services/
│   ├── utils/
│   └── validators/
├── integration/
│   ├── auth/
│   ├── content/
│   ├── team/
│   └── storage/
└── fixtures/
    ├── users.ts
    ├── workspaces.ts
    └── content.ts
```

---

## 🚀 Deployment Strategy

### Development Environment
```bash
docker-compose up
# Runs: PostgreSQL, Redis, Node.js API, mock S3 (Minio)
```

### Production Deployment
```
1. Build Docker image
2. Push to ECR/DockerHub
3. Deploy to AWS ECS / Kubernetes
4. Run database migrations
5. Configure environment variables
6. Health checks & monitoring
```

---

## 📊 Backend Development Roadmap

### Phase 1: Core API & Auth (Week 1-2)
- [ ] Project setup (Express, TypeScript, ESLint)
- [ ] Database setup (PostgreSQL migrations)
- [ ] Authentication (JWT, bcrypt)
- [ ] User registration & login
- [ ] Email verification

### Phase 2: Workspace & Onboarding (Week 2-3)
- [ ] Workspace creation & management
- [ ] Multi-tenancy implementation
- [ ] Onboarding endpoints
- [ ] Workflow stages & roles setup

### Phase 3: Content Management (Week 3-4)
- [ ] Content CRUD operations
- [ ] Stage transitions & history
- [ ] Content filtering & search
- [ ] Bulk operations

### Phase 4: Storage & File Upload (Week 4-5)
- [ ] S3 integration
- [ ] File upload endpoints
- [ ] Storage usage tracking
- [ ] Free tier limit enforcement

### Phase 5: Team & Permissions (Week 5)
- [ ] Team member management
- [ ] Role-based access control
- [ ] Invitation system
- [ ] Permission validation

### Phase 6: Analytics & Billing (Week 6)
- [ ] Analytics endpoints
- [ ] Subscription management
- [ ] Billing service setup
- [ ] Reports generation

### Phase 7: Notifications & Polish (Week 7)
- [ ] Email notifications
- [ ] In-app notifications
- [ ] Activity logging
- [ ] Testing & optimization

---

## 🔍 API Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is already registered"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "req_123abc"
}
```

### Common Error Codes
```
AUTH_ERRORS:
- INVALID_CREDENTIALS
- TOKEN_EXPIRED
- TOKEN_INVALID
- INSUFFICIENT_PERMISSIONS

VALIDATION_ERRORS:
- VALIDATION_ERROR
- INVALID_FORMAT
- REQUIRED_FIELD
- UNIQUE_CONSTRAINT

RESOURCE_ERRORS:
- NOT_FOUND
- ALREADY_EXISTS
- CONFLICT

BUSINESS_ERRORS:
- STORAGE_LIMIT_EXCEEDED
- PLAN_LIMIT_EXCEEDED
- TRIAL_EXPIRED
- INVALID_OPERATION
```

