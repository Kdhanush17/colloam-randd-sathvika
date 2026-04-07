# CreatorOps - User Role Dashboards & Permissions

## 📋 Role-Based Access Control Overview

### Role Hierarchy & Features Matrix

| Feature | Admin | Content Manager | Editor | SEO Manager | Viewer |
|---------|-------|-----------------|--------|-------------|--------|
| Dashboard | ✅ Full | ✅ Limited | ✅ Limited | ✅ Limited | ✅ Limited |
| My Tasks | ✅ All | ✅ Assigned | ✅ Assigned | ✅ Assigned | ❌ No |
| Production Board | ✅ Full | ✅ Full | ✅ Limited | ✅ Full | ✅ Read-only |
| Content Planning | ✅ Full | ✅ Full | ❌ No | ❌ No | ❌ No |
| Revenue Dashboard | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No |
| Costs Dashboard | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No |
| Storage Management | ✅ Full | ✅ Limited | ✅ View | ✅ View | ✅ View |
| Team Management | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No |
| Settings | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 👤 1. Content Manager Role

### Overview
**Content Manager** is responsible for managing the entire content lifecycle, from creation to publication planning. They have full control over content workflow but cannot manage finances or team members.

### Sidebar Navigation
```
ContentOps Workspace
├─ Dashboard              ✅ (Limited overview)
├─ My Tasks              ✅ (Assigned tasks only)
├─ Production            ✅ (Full access)
├─ Planning              ✅ (Full access)
├─ Storage               ✅ (Limited - can see usage)
├─ Team                  ✅ (View only - cannot manage)
└─ ❌ Finance section hidden
   ├─ Revenue            ❌
   ├─ Costs              ❌
   └─ Settings           ❌
```

### Dashboard Features

#### Dashboard/Overview (Limited)
**Visible Widgets:**
- Content Pipeline Overview
  - Card count by stage (all 8 stages)
  - Percentage complete per stage
  - Moving average time per stage
- Recent Tasks (assigned to them)
  - 5-10 most recent tasks
  - Status indicators (pending, in-progress, completed)
  - Due date warnings
- Team Activity Feed
  - Only shows activities related to their content
  - Who made changes to what
  - Timeline of changes
- Storage Usage Indicator
  - Current storage used (company level)
  - Storage limit
  - Warning if approaching limit
- Quick Actions
  - New Content
  - Assign Task
  - Create from Template

**Hidden Widgets:**
- Revenue Summary ❌
- Cost Analysis ❌
- Performance Metrics ❌
- Billing Info ❌

#### My Tasks
- View all tasks assigned to them
- Filter by:
  - Status (pending, in-progress, completed, blocked)
  - Priority (high, medium, low)
  - Due date
  - Content (which content it belongs to)
- Actions:
  - Mark complete
  - Update status
  - Add comments
  - Request help
- Cannot assign tasks to others ❌

#### Production Board (Full Access)
**Kanban View:**
- All 8 workflow stages visible (Idea → Script → Shoot → Edit → Upload → SEO → Publish → Revenue)
- Can create new content
- Can move content between stages
- Can edit content details
- Can assign content to team members
- Can add comments
- Full drag & drop functionality

**List View:**
- See all content in table format
- Can sortby: Title, Stage, Assigned To, Due Date, Priority, Status
- Inline editing enabled
- Bulk selection allowed
- But cannot delete content ❌
- Cannot change workspace settings ❌

**Calendar View:**
- See content publishing schedule
- Month/Week views
- Color-coded by priority/stage
- Can click to edit/view details

**Timeline/Gantt View:**
- See content timelines
- Identify blocking dependencies
- Track which team member is assigned to what

**Filters Available:**
- Stage (all 8 stages)
- Assigned To (team members only)
- Priority (High, Medium, Low)
- Status (Draft, In Progress, Completed)
- Content Type (Video, Article, Post, etc.)
- Brand (if multi-brand workspace)
- Date Range

**Bulk Actions:**
- Reassign content to team members
- Change priority (bulk)
- Change status (bulk)
- Add to campaign/collection
- Cannot delete (❌)

#### Content Planning
**Features:**
- Capture Idea
  - Quick form: Title, Description, Category
  - Save to idea library
  - Assign to content type
  - Set target publish date

- Content Plan
  - Create content plan from ideas
  - Select multiple ideas to batch create
  - Set publishing schedule
  - Assign to brands/channels

- Idea Library
  - Search/filter captured ideas
  - Convert idea to content
  - Delete old ideas
  - View idea history

#### Storage Management (Limited)
**Visible:**
- Total storage used (company level)
- Storage limit
- File browser (read-only)
- Can see which files belong to which content
- Percentage breakdown:
  - By content
  - By file type
  - By upload date

**Actions:**
- Upload new files ✅
- Download files ✅
- Delete old files (with confirmation) ⚠️
- Cannot manage team storage ❌

#### Team (View Only)
**Can See:**
- Team member list
- Member name, email, role
- Last activity date
- Which tasks assigned to each member

**Cannot Do:**
- Invite new members ❌
- Remove members ❌
- Change member roles ❌
- Manage permissions ❌

### Permissions Summary
```
Content Permissions:
✅ CONTENT_CREATE
✅ CONTENT_READ
✅ CONTENT_UPDATE
✅ CONTENT_DELETE
✅ CONTENT_MOVE_STAGE

Task Permissions:
✅ TASK_READ
✅ TASK_CREATE (for content-related tasks)
✅ TASK_UPDATE
✅ TASK_COMPLETE

Storage Permissions:
✅ STORAGE_READ
✅ STORAGE_UPLOAD
✅ STORAGE_DELETE

Team Permissions:
✅ TEAM_VIEW
❌ TEAM_MANAGE
❌ TEAM_INVITE

Finance Permissions:
❌ REVENUE_VIEW
❌ COSTS_VIEW
❌ BILLING_MANAGE

Settings Permissions:
❌ SETTINGS_VIEW
❌ SETTINGS_MANAGE
```

---

## ✏️ 2. Editor Role

### Overview
**Editor** is responsible for editing and refining content. They work primarily with content in the "Script," "Edit," and "SEO" stages. They have limited creation abilities and focus on content quality.

### Sidebar Navigation
```
ContentOps Workspace
├─ Dashboard              ✅ (Very limited overview)
├─ My Tasks              ✅ (Assigned edits only)
├─ Production            ✅ (Limited - can only edit, not move)
├─ ❌ Planning            ❌ (Cannot create content)
├─ ❌ Storage             ❌ (No access)
├─ ❌ Team                ❌ (No access)
└─ ❌ Finance section hidden
   ├─ Revenue            ❌
   ├─ Costs              ❌
   └─ Settings           ❌
```

### Dashboard Features

#### Dashboard/Overview (Very Limited)
**Visible Widgets:**
- Personal Task Count
  - Tasks assigned to them: pending, in-progress, completed
  - Pie chart: status distribution
- My Content To Edit
  - Content items assigned to them
  - Grouped by status
  - Quick links to edit each
- Recent Activity Feed
  - Only activities on content assigned to them
  - Comments on their content
  - Changes made to their assigned content

**Hidden Widgets:**
- Pipeline overview ❌
- Revenue summary ❌
- Cost analysis ❌
- Storage usage ❌
- Team activity ❌

#### My Tasks
**Features:**
- View tasks assigned to them
- All are editing/review related
- Filter by:
  - Status (pending, in-progress, completed)
  - Priority
  - Due date
  - Content type
- Actions:
  - Mark complete
  - Update status
  - Add comments
  - Request changes from creator
- Cannot create or assign tasks ❌
- Cannot reassign tasks ❌

#### Production Board (Limited Access)
**Kanban View:**
- Can see all stages but primarily works on:
  - Script stage
  - Edit stage
  - SEO stage (if applicable)
  - Publish stage (to move content after final edits)
- Cannot move content to Idea stage ❌
- Cannot move content to Shoot stage ❌ (requires creator)
- Can view other stages (read-only)
- Drag & drop enabled for their assigned content only

**List View:**
- Can filter to show only:
  - Content assigned to them
  - Content in Edit/Script/SEO stages
- Cannot bulk delete ❌
- Can inline edit content details
- Cannot change content creator ❌

**Calendar View:**
- See assigned content publish dates
- Can see deadlines
- Read-only (cannot reschedule) ❌

**Timeline View:**
- See only their assigned content
- See other team members' content (read-only)
- Identify dependencies

**Filters Available (Limited):**
- Assigned To (only their content)
- Priority (High, Medium, Low)
- Status (Draft, In Progress, Completed)
- Due Date Range

**Content Blocked Stages:**
- Cannot move from Idea, Script (initially) until marked ready for edit
- Cannot move to Shoot stage ❌
- Cannot move to Upload stage (requires creator/manager approval)

#### Storage (No Access) ❌
- Cannot upload files ❌
- Cannot browse storage ❌
- Cannot see storage usage ❌
- All storage operations blocked

#### Team (No Access) ❌
- Cannot view team member list ❌
- Cannot see who's assigned to what ❌

### Permissions Summary
```
Content Permissions:
✅ CONTENT_READ
✅ CONTENT_UPDATE (only edit/script/seo fields)
❌ CONTENT_CREATE
❌ CONTENT_DELETE
✅ CONTENT_MOVE_STAGE (only to specific stages)

Task Permissions:
✅ TASK_READ (assigned only)
✅ TASK_UPDATE
❌ TASK_CREATE
❌ TASK_DELETE
✅ TASK_COMPLETE

Storage Permissions:
❌ STORAGE_READ
❌ STORAGE_UPLOAD
❌ STORAGE_DELETE

Team Permissions:
❌ TEAM_VIEW
❌ TEAM_MANAGE

Finance Permissions:
❌ REVENUE_VIEW
❌ COSTS_VIEW
❌ BILLING_MANAGE

Settings Permissions:
❌ SETTINGS_VIEW
❌ SETTINGS_MANAGE
```

### Editable Fields
**In Content Detail:**
- Title (minor edits only)
- Description
- Script (full edit)
- Edit notes
- SEO keywords
- Meta description
- Tags
- Comments

**Cannot Edit:**
- Content Type ❌
- Brand ❌
- Creator ❌
- Revenue tracking ❌
- Publish date (only manager can change) ❌

---

## 🔍 3. SEO Manager Role

### Overview
**SEO Manager** is responsible for optimizing content for search engines. They work primarily with content in the "SEO" stage and can view content being prepared for publishing. They focus on keywords, meta descriptions, and SEO best practices.

### Sidebar Navigation
```
ContentOps Workspace
├─ Dashboard              ✅ (SEO-focused overview)
├─ My Tasks              ✅ (SEO tasks only)
├─ Production            ✅ (Limited - SEO focus)
├─ ❌ Planning            ❌ (No access)
├─ ❌ Storage             ❌ (No access)
├─ ❌ Team                ❌ (No access)
└─ ❌ Finance section hidden
   ├─ Revenue            ❌
   ├─ Costs              ❌
   └─ Settings           ❌
```

### Dashboard Features

#### Dashboard/Overview (SEO-Focused)
**Visible Widgets:**
- SEO Pipeline Overview
  - Content in "SEO" stage
  - Content waiting for SEO optimization
  - Recently optimized content
  - Optimization completion percentage

- My SEO Tasks
  - Tasks assigned to them (SEO related)
  - Status: Pending, In-Progress, Completed
  - Due dates
  - Priority indicators

- Recent Activity Feed
  - Only SEO-related activities
  - Content moved to SEO stage
  - Comments on SEO tasks
  - Optimizations completed

- SEO Metrics (if available)
  - Average keyword density
  - Meta description compliance
  - Quality score averages
  - Common SEO issues identified

**Hidden Widgets:**
- General pipeline overview ❌
- Revenue summary ❌
- Cost analysis ❌
- Storage usage ❌
- Team activity ❌

#### My Tasks
**Features:**
- View SEO-specific tasks assigned to them
- Task types:
  - Optimize content for keywords
  - Write meta descriptions
  - Add internal links
  - Add technical SEO improvements
  - Keyword research
- Filter by:
  - Status
  - Priority
  - Due date
  - Content type
- Actions:
  - Mark complete
  - Update status
  - Add comments/notes
  - Request clarification
- Cannot create tasks ❌
- Cannot assign tasks ❌

#### Production Board (Limited Access)
**Kanban View:**
- Focus on "SEO" stage (highlighted)
- Can see content in:
  - Edit stage (read-only)
  - SEO stage (full edit)
  - Publish stage (read-only, after final check)
  - Revenue stage (read-only)
- Cannot see/edit:
  - Idea stage ❌
  - Script stage ❌
  - Shoot stage ❌
  - Upload stage ❌
- Can add comments to content in any stage (read-only)
- Drag & drop only works within SEO stage

**List View:**
- Filter to show:
  - Content in SEO stage (assigned to them)
  - Content with SEO issues/warnings
  - Content awaiting SEO optimization
- Can sort by:
  - Title
  - Assigned To
  - Due Date
  - SEO Status
- Cannot modify stage directly ❌ (can only mark as "SEO Complete")

**Calendar View:**
- See content SEO deadlines
- See when content needs optimization
- Read-only (cannot reschedule) ❌

**Timeline View:**
- See content in SEO pipeline
- Identify bottlenecks
- See team member assignments (read-only)

**Filters Available (Limited):**
- Stage: Only SEO-related stages
- Priority (High, Medium, Low)
- Status (Pending Optimization, In Progress, Completed)
- Due Date Range
- Content Type (Video, Article, Blog, etc.)

#### Storage (No Access) ❌
- Cannot upload files ❌
- Cannot browse storage ❌
- Cannot access resources ❌

#### Team (No Access) ❌
- Cannot view team members ❌
- Cannot see assignments ❌

### Permissions Summary
```
Content Permissions:
✅ CONTENT_READ
✅ CONTENT_UPDATE (only SEO fields)
❌ CONTENT_CREATE
❌ CONTENT_DELETE
✅ CONTENT_MOVE_STAGE (only within SEO workflow)

Task Permissions:
✅ TASK_READ (SEO tasks only)
✅ TASK_UPDATE
❌ TASK_CREATE
❌ TASK_DELETE
✅ TASK_COMPLETE

Storage Permissions:
❌ STORAGE_READ
❌ STORAGE_UPLOAD
❌ STORAGE_DELETE

Team Permissions:
❌ TEAM_VIEW
❌ TEAM_MANAGE

Finance Permissions:
❌ REVENUE_VIEW
❌ COSTS_VIEW
❌ BILLING_MANAGE

Settings Permissions:
❌ SETTINGS_VIEW
❌ SETTINGS_MANAGE
```

### Editable Fields (SEO-Focused)
**In Content Detail:**
- Keywords
- Meta description
- Meta title
- Internal links
- SEO notes
- Technical SEO improvements
- Schema markup suggestions
- Comments/feedback

**Cannot Edit:**
- Title (main content) ❌
- Description (main content) ❌
- Content type ❌
- Brand ❌
- Creator ❌
- Script/Edit details ❌
- Revenue tracking ❌

---

## 👁️ 4. Viewer Role (Bonus)

### Overview
**Viewer** has read-only access to the entire platform. They can view content, tasks, and analytics but cannot make any modifications. Useful for stakeholders, clients, or observers.

### Sidebar Navigation
```
ContentOps Workspace
├─ Dashboard              ✅ (Read-only overview)
├─ My Tasks              ✅ (View assigned - cannot edit)
├─ Production            ✅ (Read-only view)
├─ ❌ Planning            ❌
├─ Storage               ✅ (View only)
├─ ❌ Team                ❌
└─ ❌ Finance section hidden
   ├─ Revenue            ✅ (View only)
   ├─ Costs              ❌
   └─ Settings           ❌
```

### Features (All Read-Only)
- Dashboard: View all metrics
- Production Board: View all stages, content, tasks (cannot edit)
- My Tasks: View tasks, cannot update status ❌
- Storage: View usage (cannot upload/delete)
- Revenue: View analytics (cannot access costs)
- Cannot create/edit anything ❌
- Can download reports & exports ✅
- Can view activity logs ✅

### Permissions Summary
```
All permissions set to READ-ONLY (❌ for any modifications)
```

---

## 🔐 Request Review/Approval Workflow

### Content Moving Between Stages
When content needs to move between stages, different roles have different restrictions:

```
Idea → Script:
- Creator/Content Manager needed to transition
- Editor cannot move from Idea

Script → Edit:
- Content Manager can move
- Once in Edit, Editor can work

Edit → Upload:
- Requires Content Manager approval
- Editor cannot move directly

SEO → Publish:
- Content Manager must approve
- SEO Manager can mark "Ready for Publish"

Publish → Revenue:
- Admin/Content Manager marks after publishing
- Automatic after publish date reached
```

---

## 📊 Role-Based Dashboard Sections

### Visibility Matrix

| Section | Admin | Content Manager | Editor | SEO Manager | Viewer |
|---------|-------|-----------------|--------|-------------|--------|
| Overview | Full | Limited | Very Limited | SEO-Focused | Limited |
| My Tasks | All Tasks | Team Tasks | Assigned Only | SEO Tasks | Assigned Only |
| Production Board | Full Control | Full Control | Limited Edit | SEO Focus | Read-Only |
| Content Planning | Full | Full | No | No | No |
| Revenue | Full | No | No | No | Yes (View) |
| Costs | Full | No | No | No | No |
| Storage | Full | Limited | View | No | View |
| Team | Full | View | No | No | No |
| Settings | Full | No | No | No | No |

---

## 🎯 Common User Workflows

### Content Manager Workflow
```
1. Create new content → Production Board (Idea stage)
2. Review with team → Comments/feedback
3. Move to Script → Assign to creators
4. Monitor progress → Timeline view
5. Approval flow → With Admin/Creator
6. Move to Publish → Set schedule
7. Track completion → Analytics
```

### Editor Workflow
```
1. Check assigned tasks → My Tasks
2. Open content in Edit stage → Production Board
3. Review script/content → Edit fields
4. Add comments/suggestions → Comment section
5. Mark complete → Task status
6. Request review → If changes needed
```

### SEO Manager Workflow
```
1. Check SEO tasks → My Tasks
2. Find content in SEO stage → Production Board
3. Add keywords & meta → Content detail
4. Optimize for search → SEO fields
5. Add internal links → Link builder
6. Mark ready for publish → Move to next stage
```

---

## 🔄 Transition Between Roles

### What Changes When Role Changes
- Sidebar menu updates immediately
- Dashboard widgets refresh
- Content visible in Production Board changes
- Permissions enforced on next action

### Same Account, Multiple Workspaces
- User can be different roles in different workspaces
- Role shown in top header
- Switch workspace → role switches

---

## 📱 Mobile App Role Support

### Supported on React Native
- Admin: Full features (limited due to mobile)
- Content Manager: My Tasks, Production Board (Kanban only)
- Editor: My Tasks, Edit mode
- SEO Manager: My Tasks, SEO optimization
- Viewer: View-only mode (no edit)

### Mobile-Specific Limitations
- No bulk actions on mobile
- Simplified filters
- Gesture-based stage transitions (swipe)
- No Gantt/Timeline view on mobile

