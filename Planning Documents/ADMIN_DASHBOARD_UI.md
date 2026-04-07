# CreatorOps - Admin Dashboard UI/UX Specification

## 📐 Layout Overview

### Main Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  Header (Top Navigation Bar)                       │
├──────────┬────────────────────────────────────────┤
│          │                                        │
│ Sidebar  │ Main Content Area                      │
│ (Fixed   │ (Scrollable)                           │
│ Width)   │                                        │
│          │                                        │
│          │                                        │
└──────────┴────────────────────────────────────────┘
```

---

## 🎨 Component Specifications

### 1. Left Sidebar Navigation

**Width**: ~250px (collapsible to ~60px)

**Components**:
- **Logo/Brand Section** (top)
  - CreatorOps logo
  - Workspace name/dropdown
  - Dropdown arrow (to switch workspaces)

- **Navigation Menu Items**:
  ```
  ├─ 📊 Dashboard
  ├─ ✓ My Tasks (with red badge for pending count)
  ├─ 📋 Production Board
  │  └─ Sub-items (when expanded):
  │     ├─ Kanban
  │     ├─ List
  │     ├─ Calendar
  │     └─ Timeline
  ├─ 📝 Content Planning
  ├─ 💰 Revenue Dashboard
  ├─ 💸 Costs Dashboard
  ├─ 💾 Storage Management
  ├─ 👥 Team Management
  └─ ⚙️ Settings
  ```

- **Profile Section** (bottom)
  - User avatar (circular, 40x40px)
  - User name
  - Dropdown menu (Profile, Settings, Logout)

**Styling**:
- Background: Light gray or white (#F5F5F5 or #FFFFFF)
- Text color: Dark gray (#333333)
- Active menu item: Blue background with white text or left blue border
- Hover state: Light blue background
- Dividers: Light gray lines between sections

---

### 2. Header/Top Navigation Bar

**Height**: ~60px

**Components**:
- **Left Section**:
  - Hamburger menu (to toggle sidebar on mobile/tablet)

- **Center Section**:
  - Page title (e.g., "Production Board", "My Tasks")
  - Breadcrumb navigation (optional): Dashboard > Production Board

- **Right Section**:
  - Search bar (with icon, ~250px wide)
    - Placeholder: "Search content, tasks, team..."
  - Notifications icon (with red badge for count)
  - Help/Documentation icon (?)
  - User profile button (avatar + name)

**Styling**:
- Background: White
- Border-bottom: 1px light gray (#E0E0E0)
- Text: Dark gray (#333333)
- Accent color: Blue (#007BFF or similar)

---

### 3. Production Board - Kanban View

#### Kanban Container
- **Stage Columns**: One column per workflow stage
  - Default stages: Idea → Script → Shoot → Edit → Upload → SEO → Publish → Revenue
  - Each column width: ~300-350px
  - Horizontal scrollable if needed

#### Stage Column Header
```
┌──────────────────────────────┐
│ Stage Name           [+]     │
│ (3 items)                    │
├──────────────────────────────┤
│                              │
│  [Content Card]              │
│  [Content Card]              │
│  [Content Card]              │
│                              │
├──────────────────────────────┤
│  [Add new card]              │
└──────────────────────────────┘
```

**Stage Column Features**:
- Stage name with item count
- Plus (+) button to add new content to stage
- Droppable area (visual feedback on drag-over)
- Color-coded header (optional - different color per stage)

#### Content Card
```
┌───────────────────────────────────────┐
│ 🎥 [Thumbnail]                        │
├───────────────────────────────────────┤
│ Content Title (truncated if long)    │
│ "Create YouTube Intro Tutorial"      │
├───────────────────────────────────────┤
│ 👤 Assigned User Avatar               │
│ Dhanush  │  Due: Mar 28               │
├───────────────────────────────────────┤
│ [🔴 High] [💬 3] [📎 2]              │
└───────────────────────────────────────┘
```

**Content Card Elements**:
- Thumbnail/Preview Image (16:9 ratio)
- Content Title (max 2 lines, truncated with ellipsis)
- Assigned user avatar (circular, ~32px)
- Assigned user name
- Due date
- Priority badge (red=High, yellow=Medium, green=Low)
- Comments count (with comment icon)
- Attachment count (with paperclip icon)

**Card Interactions**:
- Hover: Show shadow, slight scale-up (transform: scale(1.02))
- Right-click: Context menu (Edit, Delete, Duplicate, etc.)
- Left-click: Open detail drawer/modal
- Drag: Draggable between columns with visual feedback

**Styling**:
- Background: White
- Border: 1px light gray (#E0E0E0)
- Border-radius: 4px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Hover shadow: 0 4px 8px rgba(0,0,0,0.15)

---

### 4. Production Board - Advanced Filters & Controls

**Toolbar Above Kanban**:
```
┌─────────────────────────────────────────────────────────────┐
│ [Kanban] [List] [Calendar] [Timeline] │ [Search...] [Filter] │
│                                       │   [Sort] [Export]    │
└─────────────────────────────────────────────────────────────┘
```

**View Toggle Buttons**:
- Kanban (default, highlighted)
- List
- Calendar
- Timeline
- Icons or text buttons

**Search Bar**:
- Placeholder: "Search content by title or description..."
- Real-time search results
- Clear button (X icon)

**Filter Dropdown/Sidebar**:
- Collapsible filter panel
- Filter options:
  ```
  Stage: [All] [Idea] [Script] [Shoot] [Edit] [Upload] [SEO] [Publish] [Revenue]
  Assigned To: [All] [Dhanush] [Team Members...]
  Priority: [All] [High] [Medium] [Low]
  Status: [All] [Draft] [In Progress] [Completed] [Archived]
  Content Type: [All] [Video] [Article] [Post] [Image] [Other]
  Brand: [All] [Brand 1] [Brand 2] [All Brands...]
  Date Range: [Any] [Today] [This Week] [This Month] [Custom Range]
  ```
- Apply & Clear buttons

**Sort Options**:
- Sort by: Due Date, Created Date, Priority, Assignee, Title

---

### 5. Production Board - List View

**Table Structure**:
```
┌──────┬─────────────┬────────┬────────────┬──────────┬────────┬────────────┐
│      │ Title       │ Stage  │ Assigned   │ Due Date │ Prty   │ Status     │
├──────┼─────────────┼────────┼────────────┼──────────┼────────┼────────────┤
│ [☐]  │ Content 1   │ Script │ Dhanush    │ Mar 28   │ 🔴 High│ In Prog... │
│ [☐]  │ Content 2   │ Edit   │ Team Member│ Mar 30   │ 🟡 Med │ In Prog... │
│ [☐]  │ Content 3   │ Publish│ Dhanush    │ Apr 2    │ 🟢 Low │ Draft      │
└──────┴─────────────┴────────┴────────────┴──────────┴────────┴────────────┘
```

**Column Headers**:
- Checkbox (select all)
- Title (with thumbnail, clickable)
- Stage (dropdown inline edit)
- Assigned To (user avatar, editable)
- Due Date (editable)
- Priority (color badge, editable)
- Status (editable dropdown)

**Row Features**:
- Hover: Background color highlight
- Checkbox: Select individual rows
- Click row: Open detail view
- Drag row: Drag to reorder (optional)

**Inline Editing**:
- Double-click cell to edit
- Dropdown cells for Stage, Priority, Status
- Date picker for Due Date
- User selector for Assigned To

---

### 6. Production Board - Calendar View

**Calendar Structure**:
```
View: [Month] [Week] [Day]

March 2026
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Sun │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │
├─────┴─────┴─────┴─────┴─────┴─────┴─────┤
│                                           │
│ 1   │ 2   │ 3   │ 4   │ 5   │ 6   │ 7   │
│     │[📝] │[📝] │     │     │[📝] │     │
│     │     │     │     │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 8   │ 9   │ 10  │ 11  │ 12  │ 13  │ 14  │
│[📝] │[📝] │[📝] │[📝] │     │[📝] │     │
│     │     │     │     │     │     │     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

**Day Cell Content**:
- Small colored dots/badges for each content piece
- Color-coded by:
  - Stage (different color per stage)
  - Priority (higher priority more prominent)
- Hover: Show tooltip with content title
- Click: Show content list for that day or open detail

**View Options**:
- Month view (default): Full month at a glance
- Week view: 7 days column layout with time slots
- Day view: Single day expanded view

---

### 7. Production Board - Timeline/Gantt View

**Timeline Structure**:
```
Team Members / Assignee
├─ Dhanush
│  ├─ ████████ Content 1 (Shoot stage, Mar 25-28)
│  ├─ ██████████ Content 2 (Edit stage, Mar 28-Apr 2)
│  └─ ████ Content 3 (Idea stage, Apr 5-7)
├─ Team Member 2
│  ├─ ████████ Content 4 (Script stage, Mar 26-30)
│  └─ ██████ Content 5 (Upload stage, Mar 29-31)
└─ Team Member 3
   ├─ ████████ Content 6 (SEO stage, Mar 27-29)
   └─ ███ Content 7 (Publish stage, Mar 30-Apr 1)

Timeline:     Mar 25    Mar 27    Mar 29    Mar 31    Apr 2    Apr 4
```

**Bar Components**:
- Each bar represents content in a specific stage
- Bar color: By stage or priority
- Bar label: Content title (if space allows)
- Hover: Show details tooltip
- Drag: Reschedule content (change due date)
- Click: Open content detail

---

### 8. Content Creating/Editing Modal

**Create New Content Modal**:
```
┌─────────────────────────────────────────┐
│ ✕ Create New Content                   │
├─────────────────────────────────────────┤
│                                         │
│ Content Title *                         │
│ [________________]                      │
│                                         │
│ Description                             │
│ [________________________________________] (3 lines)
│                                         │
│ Content Type *        Brand (if multi-brand) │
│ [📹 Video ▼]          [Brand 1 ▼]      │
│                                         │
│ Priority              Assigned To       │
│ [🔴 High ▼]           [Dhanush ▼]      │
│                                         │
│ Due Date              Status            │
│ [📅 Mar 28 ▼]         [Draft ▼]         │
│                                         │
│ Tags/Labels                             │
│ [tag1] [tag2] [+add tag]                │
│                                         │
│ Attachments                             │
│ [📎] Click to upload or drag files      │
│                                         │
│ [Create] [Cancel]                       │
├─────────────────────────────────────────┤
```

**Form Fields**:
1. **Content Title** (required)
   - Text input, max 255 characters
   - Character counter

2. **Description** (optional)
   - Textarea, supports markdown or rich text
   - Max 2000 characters

3. **Content Type** (required)
   - Dropdown: Video, Article, Post, Image, Podcast, Other
   - Icon selector available

4. **Brand** (conditional)
   - Dropdown (only if workspace has multiple brands)
   - Defaults to current brand

5. **Priority** (optional, defaults to Medium)
   - Radio buttons or dropdown: High, Medium, Low
   - Color-coded

6. **Assigned To** (optional)
   - User dropdown or multi-select (if collaborative)
   - Currently only single assignment

7. **Due Date** (optional)
   - Date picker
   - Can set time as well (optional)

8. **Status** (optional, defaults to Draft)
   - Dropdown: Draft, In Progress, Completed, Archived

9. **Tags/Labels** (optional)
   - Chip input
   - Existing tag suggestions
   - Add new tags on the fly

10. **Attachments** (optional)
    - Drag-and-drop zone
    - Click to browse
    - Multiple file support
    - Progress indicator during upload

**Modal Layout**:
- Fixed width modal (600-800px)
- Scrollable content area
- Sticky header with title and close button
- Sticky footer with action buttons
- Close on Escape key or clicking outside (with confirmation if changes made)

---

### 9. Content Detail Drawer/Modal

**Tabs Structure**:
```
Content Title: "YouTube Intro Tutorial"
[Overview] [Files] [Comments] [Activity] [Finance]

┌─────────────────────────────────────────┐
│ ✕ → Overview Tab                       │
├─────────────────────────────────────────┤
│ Status: [In Progress ▼]                │
│ Stage: [Edit ▼]                        │
│ Assigned To: [Dhanush ▼]               │
│                                         │
│ Details                                 │
│ ├─ Type: Video                         │
│ ├─ Brand: TechChannel                  │
│ ├─ Created: Mar 25, 2026               │
│ ├─ Created By: Dhanush                 │
│ ├─ Modified: Mar 28, 2026              │
│ ├─ Due Date: Mar 28, 2026              │
│ └─ Priority: 🔴 High                   │
│                                         │
│ Description                             │
│ [Description text here...]              │
│                                         │
│ [Edit] [Delete]                        │
└─────────────────────────────────────────┘

Files Tab: [List of attached files with download/delete]
Comments Tab: [Comment thread]
Activity Tab: [Activity log/timeline]
Finance Tab: [Revenue tracking, costs]
```

---

### 10. Content Planning Section

**Idea Capture Modal**:
```
┌──────────────────────────────┐
│ ✕ Capture Idea              │
├──────────────────────────────┤
│ Idea Title *                │
│ [___________________]       │
│                              │
│ Idea Description            │
│ [________________________]   │
│                              │
│ Category/Topic              │
│ [Comedy ▼]                  │
│                              │
│ [Save Idea] [Cancel]        │
└──────────────────────────────┘
```

**Content Planning View**:
- Idea Library: List of saved ideas
  - Each idea card: Title, category, date saved, actions (view, convert to content, delete)
- Content Plan Creation:
  - Select idea → Create content → Auto-populate title, description, category

---

## 🎯 Color Scheme

**Primary Colors**:
- Primary Blue: #007BFF (or #2E88D8)
- Secondary: #6C757D (Gray)
- Success: #28A745 (Green)
- Danger: #DC3545 (Red)
- Warning: #FFC107 (Yellow)
- Info: #17A2B8 (Cyan)

**Priority Colors** (Consistent across app):
- High: #DC3545 (Red)
- Medium: #FFC107 (Yellow)
- Low: #28A745 (Green)

**Stage Colors** (Optional - for visual differentiation):
- Idea: #17A2B8 (Cyan)
- Script: #6F42C1 (Purple)
- Shoot: #E83E8C (Pink)
- Edit: #FD7E14 (Orange)
- Upload: #20C997 (Teal)
- SEO: #007BFF (Blue)
- Publish: #28A745 (Green)
- Revenue: #FFC107 (Gold)

**Neutral Colors**:
- White: #FFFFFF
- Light Gray: #F5F5F5
- Border Gray: #E0E0E0
- Dark Text: #333333
- Light Text: #666666

---

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (Full layout with sidebar)
- **Tablet**: 768px-1199px (Sidebar collapses, main content adjusts)
- **Mobile**: <768px (Sidebar hidden/hamburger menu, single column layout)

---

## ⌨️ Keyboard Shortcuts (Optional for Admin)

- `S`: Search
- `N`: New content
- `F`: Filter
- `Ctrl/Cmd + K`: Command palette (open, navigate, search)
- `Esc`: Close modal/drawer

---

## 🔔 Real-time Notifications

**Toast Notifications** (bottom-right):
- Content created successfully
- Content updated
- Comment added
- Task assigned to you
- Deadline approaching
- Storage limit warning

**Notification Badges**:
- Red badge on "My Tasks" when new tasks assigned
- Red badge on notifications bell icon for unread notifications

