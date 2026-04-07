# CreatorOps - Architecture Diagrams & Visual Documentation

## 1️⃣ SYSTEM ARCHITECTURE DIAGRAM

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           CreatorOps Platform                                │
│                        Multi-Tenant SaaS System                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        CLIENT LAYERS                                    │ │
│  ├─────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                         │ │
│  │  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐  │ │
│  │  │   React Web      │   │  React Native    │   │  Mobile Browser  │  │ │
│  │  │   Dashboard      │   │  (iOS/Android)   │   │  (Responsive)    │  │ │
│  │  │  (Admin, Users)  │   │  Mobile App      │   │                  │  │ │
│  │  └────────┬─────────┘   └────────┬─────────┘   └────────┬─────────┘  │ │
│  │           │                      │                      │             │ │
│  │           └──────────────────────┼──────────────────────┘             │ │
│  │                                  │                                    │ │
│  └──────────────────────────────────┼────────────────────────────────────┘ │
│                                     │                                       │
│                            REST API (HTTPS/v1)                              │
│                                     │                                       │
│  ┌──────────────────────────────────▼────────────────────────────────────┐  │
│  │                      EXPRESS.JS BACKEND LAYER                         │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                        │  │
│  │  ┌───────────────────────────────────────────────────────────────┐  │  │
│  │  │  MIDDLEWARE STACK                                             │  │  │
│  │  │  ├─ CORS, Helmet, Body Parser, Request Logger               │  │  │
│  │  │  ├─ Rate Limiter, Request Validator                         │  │  │
│  │  │  ├─ Auth Middleware (JWT Validation)                        │  │  │
│  │  │  └─ Multi-tenancy Detector (Workspace Extraction)           │  │  │
│  │  └────────────────────┬──────────────────────────────────────────┘  │  │
│  │                       │                                             │  │
│  │  ┌────────────────────▼──────────────────────────────────────────┐  │  │
│  │  │  ROUTES & CONTROLLERS (40+ endpoints)                        │  │  │
│  │  │  ├─ /auth            → Auth Controller                       │  │  │
│  │  │  ├─ /users           → User Controller                       │  │  │
│  │  │  ├─ /workspaces      → Workspace Controller                  │  │  │
│  │  │  ├─ /content         → Content Controller                    │  │  │
│  │  │  ├─ /tasks           → Task Controller                       │  │  │
│  │  │  ├─ /teams           → Team Controller                       │  │  │
│  │  │  ├─ /storage         → Storage Controller                    │  │  │
│  │  │  ├─ /analytics       → Analytics Controller                  │  │  │
│  │  │  └─ /billing         → Billing Controller                    │  │  │
│  │  └────────────────────┬──────────────────────────────────────────┘  │  │
│  │                       │                                             │  │
│  │  ┌────────────────────▼──────────────────────────────────────────┐  │  │
│  │  │  SERVICE LAYER (Business Logic)                              │  │  │
│  │  │  ├─ AuthService          ├─ StorageService                   │  │  │
│  │  │  ├─ UserService          ├─ S3Service                        │  │  │
│  │  │  ├─ WorkspaceService     ├─ NotificationService             │  │  │
│  │  │  ├─ ContentService       ├─ TeamService                      │  │  │
│  │  │  ├─ TaskService          ├─ PermissionService               │  │  │
│  │  │  ├─ AnalyticsService     └─ BillingService                   │  │  │
│  │  └────────────────────┬──────────────────────────────────────────┘  │  │
│  │                       │                                             │  │
│  └───────────────────────┼─────────────────────────────────────────────┘  │
│                          │                                                 │
│  ┌───────────────────────┼─────────────────────────────────────────────┐  │
│  │    DATA & STORAGE LAYER                                             │  │
│  ├───────────────────────┼─────────────────────────────────────────────┤  │
│  │                       │                                             │  │
│  │  ┌────────────────────▼──────────────┐    ┌──────────────────────┐ │  │
│  │  │   PostgreSQL Database             │    │  AWS S3 Storage      │ │  │
│  │  │   (25+ Tables)                    │    │  (File Storage)      │ │  │
│  │  │                                   │    │                      │ │  │
│  │  │  ├─ users                         │    │  ├─ Workspace Files │ │  │
│  │  │  ├─ workspaces                    │    │  ├─ Content Media   │ │  │
│  │  │  ├─ content                       │    │  └─ Attachments    │ │  │
│  │  │  ├─ tasks                         │    │                      │ │  │
│  │  │  ├─ team_members                  │    │  Free Tier: 5GB      │ │  │
│  │  │  ├─ storage                       │    └──────────────────────┘ │  │
│  │  │  ├─ subscriptions                 │                             │  │
│  │  │  ├─ notifications                 │    ┌──────────────────────┐ │  │
│  │  │  ├─ activity_logs                 │    │  Redis Cache         │ │  │
│  │  │  └─ [...more tables]              │    │  (Optional)          │ │  │
│  │  │                                   │    │                      │ │  │
│  │  │  Workspace-Level Data Isolation   │    │  Query Cache         │ │  │
│  │  │  Multi-tenant Architecture        │    │  Session Store       │ │  │
│  │  └───────────────────────────────────┘    └──────────────────────┘ │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  EXTERNAL SERVICES                                                    │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │  │
│  │  │ SendGrid/    │  │ Stripe       │  │ Sentry Error │  │ Winston  │ │  │
│  │  │ SMTP Email   │  │ (Payments)   │  │ Tracking     │  │ Logging  │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘ │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ MULTI-TENANCY ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Multi-Tenant Workspace Architecture                      │
└─────────────────────────────────────────────────────────────────────────────┘

                              CreatorOps Platform
                                (Shared Backend)
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
        ┌───────▼────────┐    ┌───────▼────────┐    ┌───────▼────────┐
        │ Workspace 1    │    │ Workspace 2    │    │ Workspace 3    │
        ├────────────────┤    ├────────────────┤    ├────────────────┤
        │ dhanush.       │    │ agency.        │    │ production.    │
        │ creatorops.com │    │ creatorops.com │    │ creatorops.com │
        │                │    │                │    │                │
        │ Owner: User A  │    │ Owner: User B  │    │ Owner: User C  │
        │ Type:          │    │ Type:          │    │ Type:          │
        │ Individual     │    │ Agency         │    │ Production     │
        │                │    │                │    │                │
        │ ┌────────────┐ │    │ ┌────────────┐ │    │ ┌────────────┐ │
        │ │ 3 Users    │ │    │ │ 5 Users    │ │    │ │ 10 Users   │ │
        │ │ 1 Brand    │ │    │ │ 3 Brands   │ │    │ │ 2 Brands   │ │
        │ │ 5GB Store  │ │    │ │ 25GB Store │ │    │ │ 35GB Store │ │
        │ └────────────┘ │    │ └────────────┘ │    │ └────────────┘ │
        └────────┬───────┘    └────────┬───────┘    └────────┬───────┘
                 │                     │                     │
                 │     Data Isolation  │     (workspace_id)  │
                 │                     │                     │
        ┌────────▼─────────────────────▼─────────────────────▼──────┐
        │         PostgreSQL Database (Single Instance)              │
        ├───────────────────────────────────────────────────────────┤
        │                                                             │
        │  Workspace 1 Data         Workspace 2 Data                │
        │  ├─ content (ws1)         ├─ content (ws2)              │
        │  ├─ tasks (ws1)           ├─ tasks (ws2)                │
        │  ├─ team_members (ws1)    ├─ team_members (ws2)         │
        │  └─ storage (ws1)         └─ storage (ws2)              │
        │                                                             │
        │  ALL QUERIES FILTERED BY: WHERE workspace_id = ?           │
        │                                                             │
        └─────────────────────────────────────────────────────────────┘
```

---

## 3️⃣ USER REGISTRATION & ONBOARDING FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    User Registration & Onboarding Flow                       │
└─────────────────────────────────────────────────────────────────────────────┘

  1. REGISTRATION PAGE
     ┌──────────────────────┐
     │ Email                │
     │ Password             │
     │ Full Name            │
     │ Workspace Name       │
     │ [START FREE TRIAL]   │
     └──────────┬───────────┘
                │
                ▼
     ┌──────────────────────────────────────┐
     │ Backend: Auth Register                │
     │ ├─ Hash Password (bcrypt)             │
     │ ├─ Create User                        │
     │ ├─ Create Workspace                   │
     │ ├─ Create Free Trial Subscription     │
     │ ├─ Create Default Roles               │
     │ ├─ Create Default Workflow Stages     │
     │ ├─ Send Verification Email            │
     │ └─ Generate JWT Token                 │
     └──────────┬───────────────────────────┘
                │
                ▼
     ┌──────────────────────┐
     │ 7-STEP ONBOARDING    │
     └──────────┬───────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌─────┐    ┌─────┐    ┌─────┐
│Step │    │Step │    │Step │
│1    │    │2    │    │3    │
│     │    │     │    │     │
│Workst│   │Brand│    │Team │
│Type  │   │Det. │    │Size │
└─────┘    └─────┘    └─────┘
    │           │           │
    └───────────┼───────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌─────┐    ┌─────┐    ┌─────┐
│Step │    │Step │    │Step │
│4    │    │5    │    │6    │
│     │    │     │    │     │
│Roles│   │Stages│    │Freq │
└─────┘    └─────┘    └─────┘
    │           │           │
    └───────────┼───────────┘
                │
                ▼
            ┌─────┐
            │Step │
            │7    │
            │     │
            │Note │
            │Pref │
            └──┬──┘
               │
               ▼
         ┌─────────────┐
         │ ONBOARDING  │
         │ COMPLETE    │
         │             │
         │ Redirect to │
         │ Dashboard   │
         └─────────────┘
```

---

## 4️⃣ CONTENT WORKFLOW PIPELINE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Content Workflow Pipeline (8 Stages)                    │
└─────────────────────────────────────────────────────────────────────────────┘

  PROCESS: Content Creation → Publishing → Revenue Tracking

  ┌─────────┐
  │  IDEA   │
  │ Capture │
  │ Content │
  │ concept │
  └────┬────┘
       │
       │ Team Lead / Content Manager
       │ (Approves & Routes)
       │
       ▼
  ┌─────────┐
  │ SCRIPT  │
  │ Write   │
  │ content │
  │ outline │
  └────┬────┘
       │
       │ Script Writer
       │ (Creates Scripts)
       │
       ▼
  ┌─────────┐
  │  SHOOT  │
  │ Film /  │
  │ Record  │
  │ Content │
  └────┬────┘
       │
       │ Production Team
       │ (Captures Media)
       │
       ▼
  ┌─────────┐
  │  EDIT   │
  │ Edit &  │
  │ Polish  │
  │ Content │
  └────┬────┘
       │
       │ Editors
       │ (Refine Content)
       │
       ▼
  ┌─────────┐
  │ UPLOAD  │
  │ Upload  │
  │ to      │
  │ Platforms
  └────┬────┘
       │
       │ Uploaders
       │ (Publish to Platforms)
       │
       ▼
  ┌─────────┐
  │   SEO   │
  │ Optimiz-│
  │ ation   │
  │ & Tags  │
  └────┬────┘
       │
       │ SEO Manager
       │ (Optimize for Search)
       │
       ▼
  ┌─────────┐
  │ PUBLISH │
  │ Go Live │
  │ & Share │
  │ Content │
  └────┬────┘
       │
       │ Content Manager
       │ (Launch)
       │
       ▼
  ┌─────────┐
  │ REVENUE │
  │ Track $ │
  │ & ROI   │
  │ Analysis│
  └────┬────┘
       │
       │ Admin / Manager
       │ (Monitor Earnings)
       │
       ▼
  ┌──────────────┐
  │ COMPLETED    │
  │ Content Cycle│
  │ Ready for    │
  │ Next Batch   │
  └──────────────┘

CUSTOMIZABLE:
- Add/remove stages
- Reorder stages
- Set stage duration
- Assign roles per stage
```

---

## 5️⃣ ROLE-BASED ACCESS CONTROL HIERARCHY

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Role-Based Access Control (RBAC) Hierarchy                │
└─────────────────────────────────────────────────────────────────────────────┘

                            ADMIN (Full Access)
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
        ┌───────▼────────┐ ┌──────▼──────┐ ┌──────▼──────┐
        │ CONTENT        │ │   TEAM      │ │   FINANCE   │
        │ MANAGER        │ │ MANAGEMENT  │ │ MANAGEMENT  │
        ├────────────────┤ ├─────────────┤ ├─────────────┤
        │ ├─ Create      │ │ ├─ Invite   │ │ ├─ View Rev │
        │ ├─ Edit        │ │ ├─ Remove   │ │ ├─ View Cost│
        │ ├─ Delete      │ │ ├─ Assign   │ │ ├─ View Plan│
        │ ├─ Move Stages │ │ │   Roles   │ │ └─ Upgrade  │
        │ ├─ Planning    │ │ ├─ Manage   │ │   Plan      │
        │ └─ Comments    │ │ │   Perms   │ │             │
        └────────┬───────┘ └──────┬──────┘ └──────┬──────┘
                 │                │               │
        ┌────────▼────────┐ ┌─────▼──────┐ ┌────▼──────┐
        │    EDITOR       │ │ SEO        │ │  VIEWER  │
        │                 │ │ MANAGER    │ │          │
        ├─────────────────┤ ├────────────┤ ├──────────┤
        │ ├─ Edit only    │ │ ├─ SEO     │ │ Read-only│
        │ │   specific    │ │ │   fields │ │ All Data │
        │ │   stages      │ │ ├─ Keywords│ │          │
        │ ├─ Cannot       │ │ ├─ Meta    │ │ No Edit  │
        │ │   create      │ │ │   desc   │ │          │
        │ ├─ Cannot       │ │ ├─ Mark    │ │ No Delete│
        │ │   delete      │ │ │   ready  │ │          │
        │ └─ Assigned     │ │ └─ Limited │ │ No Create│
        │    tasks only   │ │   stages  │ │          │
        └────────────────┘ └────────────┘ └──────────┘

PERMISSIONS BY ROLE:

┌───────────────────┬─────────┬──────────┬────────┬───────────┬────────┐
│ Permission        │  Admin  │ Content  │ Editor │ SEO Mgr   │ Viewer │
│                   │         │ Manager  │        │           │        │
├───────────────────┼─────────┼──────────┼────────┼───────────┼────────┤
│ Content Create    │ ✅      │ ✅       │ ❌     │ ❌        │ ❌     │
│ Content Edit      │ ✅      │ ✅       │ ✅*    │ ✅**      │ ❌     │
│ Content Delete    │ ✅      │ ✅       │ ❌     │ ❌        │ ❌     │
│ Move Stages       │ ✅      │ ✅       │ Limited│ Limited   │ ❌     │
│ View Content      │ ✅      │ ✅       │ ✅     │ ✅        │ ✅     │
│ Invite Team       │ ✅      │ ❌       │ ❌     │ ❌        │ ❌     │
│ Manage Roles      │ ✅      │ ❌       │ ❌     │ ❌        │ ❌     │
│ View Revenue      │ ✅      │ ❌       │ ❌     │ ❌        │ ✅**   │
│ View Costs        │ ✅      │ ❌       │ ❌     │ ❌        │ ❌     │
│ Manage Plans      │ ✅      │ ❌       │ ❌     │ ❌        │ ❌     │
│ View Analytics    │ ✅      │ Limited  │ Limited│ Limited   │ Limited│
│ Change Settings   │ ✅      │ ❌       │ ❌     │ ❌        │ ❌     │
│                   │         │          │        │           │        │
└───────────────────┴─────────┴──────────┴────────┴───────────┴────────┘

* Editor: Only specific stages (Edit, Script, SEO)
** SEO Manager: Only SEO fields (keywords, meta)
*** Viewer: Read-only revenue (if enabled)
```

---

## 6️⃣ PRODUCTION BOARD - KANBAN VIEW WITH DRAG & DROP

```
┌─────────────────────────────────────────────────────────────────────────────┐
│           Production Board - Kanban View (Drag & Drop Between Stages)        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┬──────────┬─────────┬──────────┬────────┬────────┬──────────┬───────┐
│     IDEA    │  SCRIPT  │  SHOOT  │   EDIT   │ UPLOAD │  SEO   │ PUBLISH  │REVENUE│
│  (5 items)  │(3 items) │(2 items)│(4 items) │(1 item)│(2 items)(3 items) │(0)   │
├─────────────┼──────────┼─────────┼──────────┼────────┼────────┼──────────┼───────┤
│             │          │         │          │        │        │          │       │
│┌───────────┐│┌────────┐│┌───────┐│┌────────┐│┌──────┐│┌──────┐│┌────────┐│       │
││ 📹 YouTube│││ 📝 Blog│││📹Video│││ Video  │││Upload│││ SEO  │││Publish ││       │
││ Intro     │││ Post  │││Product│││ Edit  │││Video │││Video ││││Content ││       │
││ Tutorial  │││Details│││Review └││  Post ││ Post ││Video ││││Series  ││       │
││           ││        │││        │││       ││ Link  │││Post  ││││Part 1  ││       │
││👤 Dhanush││        │││👤 Team │││👤 User││ Meta  │││      │││         ││       │
││Due:Mar28││        │││Due:Mar││||Due:Apr││ Desc  │││      │││         ││       │
││🔴 High  ││        │││    28││ │01      │││       │││      │││         ││       │
││💬3 👎2  ││        │││🟡Med ││ │🟢 Low  │││       │││      │││         ││       │
│└───────────┘│        │││       ││└────────┘││       ││└──────┘││└────────┘│       │
│             │        │││       ││          ││       ││        ││          │       │
│ ┌────────┐  │┌──────┐│││       ││          ││       ││        ││          │       │
│ │ 📺 TikTok││ │ Script││       ││          ││       ││        ││          │       │
│ │ Dance  ││ │Rewrite││       ││          ││       ││        ││          │       │
│ │Challenge││          │││       ││          ││       ││        ││          │       │
│ │         ││          │││       ││          ││       ││        ││          │       │
│ │👤 Sarah ││          │││       ││          ││       ││        ││          │       │
│ │Due:Mar30││          │││       ││          ││       ││        ││          │       │
│ │🔴 High ││          │││       ││          ││       ││        ││          │       │
│ │💬1 👎0 ││          │││       ││          ││       ││        ││          │       │
│ └────────┘│└──────┐││       ││          ││       ││        ││          │       │
│           │       ││││       ││          ││       ││        ││          │       │
│ ┌────────┐│       ││││       ││          ││       ││        ││          │       │
│ │📝Article││       ││ │       ││          ││       ││        ││          │       │
│ │Writing  ││       │││ └──────┼──────────┼┴─────┐ │└──────┘││          │       │
│ │Tips     ││       │││        │          │      │ │        ││          │       │
│ │         ││       │││        │          │      │ │        ││          │       │
│ │👤 James ││       │││        │          │      │ │        ││          │       │
│ │Due:Apr2 ││       │││        │          │      │ │        ││          │       │
│ │🟢 Low  ││       │││        │          │      │ │        ││          │       │
│ │💬0 👎0 ││       │││        │          │      │ │        ││          │       │
│ └────────┘│       ││└────────┴──────────┘      │ │        ││          │       │
│           │       ││                            │ │        ││          │       │
│ ┌──────┐  │       ││                            │ │        ││          │       │
│ │+ Add │  │       ││                            └─┘        ││          │       │
│ │Card  │  │       ││                                       ││          │       │
│ └──────┘  │       ││                                       ││          │       │
│           │       ││                                       ││          │       │
│           └────┬──┘│       ││                                       ││          │       │
│                │   │       ││                                       ││          │       │
│           [+Idea]  │       ││                               ┌──────┐││          │       │
│                    │       ││                               │      │││          │       │
│                    └───┬───┘│       ││                               │└──────┘││          │       │
│                        │   │       ││                               │         ││          │       │
│                        │   [+Script]         [+Upload]  [+Publish]          │       │
│                        │                                               │
│                        │ DRAG TO MOVE ─────────────────────────────────►        │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘

FEATURES:
✅ Drag & Drop Between Stages
✅ Content Preview on Hover
✅ Real-time Updates
✅ Notification on Move
✅ Activity Logged
```

---

## 7️⃣ STORAGE MANAGEMENT & FREE TIER ENFORCEMENT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              Storage Management & Free Tier Enforcement Logic                 │
└─────────────────────────────────────────────────────────────────────────────┘

  USER UPLOADS FILE
           │
           ▼
  ┌──────────────────────┐
  │ Check Storage Limit  │
  │ (Free Tier: 5GB)     │
  └──────────┬───────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
  ✅ ALLOW          ❌ DENY
  (< limit)         (≥ limit)
    │                 │
    │                 ▼
    │            ┌─────────────┐
    │            │ Show Error  │
    │            │ "Storage    │
    │            │ Limit      │
    │            │ Exceeded"   │
    │            └─────────────┘
    │
    ▼
┌─────────────────────────┐
│ Upload to AWS S3        │
│ ├─ Generate S3 Key      │
│ ├─ Upload Multi-part    │
│ ├─ Create DB Record     │
│ └─ Update Storage Usage │
└────────────┬────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Update Storage Metrics │
    └────────────┬───────────┘
                 │
                 ▼
    ┌─────────────────────────────┐
    │ Check Usage Percentage       │
    └────────────┬────────────────┘
                 │
      ┌──────────┼──────────┐
      │          │          │
      ▼          ▼          ▼
   <90%        90%        100%
      │          │          │
      │          ▼          ▼
      │    ┌──────────┐  ┌─────────┐
      │    │ WARNING  │  │ BLOCKED │
      │    │ Email:   │  │ Email:  │
      │    │ "90% of  │  │ Storage │
      │    │ storage  │  │ Full!   │
      │    │ used"    │  │ Upgrade │
      │    └──────────┘  │ Plan    │
      │                  └─────────┘
      │
      ▼
   SUCCESS
   File Stored


STORAGE BY PLAN:
┌──────────────┬──────────┬────────────────┐
│ Plan         │ Limit    │ Free Tier?     │
├──────────────┼──────────┼────────────────┤
│ Free         │ 5GB      │ ✅ 5GB Fixed   │
│              │          │ ❌ No Upgrades │
│              │          │ ❌ No Changes  │
├──────────────┼──────────┼────────────────┤
│ Starter      │ 10-20GB  │ ❌ Upgradeable │
├──────────────┼──────────┼────────────────┤
│ Team         │ 25-35GB  │ ❌ Upgradeable │
├──────────────┼──────────┼────────────────┤
│ Business     │ 80-100GB │ ❌ Upgradeable │
└──────────────┴──────────┴────────────────┘

ENFORCEMENT POINTS:
┌─────────────────────────────────────────────┐
│ 1. Before Upload (API Check)                │
│    └─ Calculate total after upload          │
│    └─ Validate against plan limit           │
│                                             │
│ 2. At 90% Usage (Warning)                   │
│    └─ Send email notification               │
│    └─ Show in-app banner                    │
│    └─ No action taken (upload allowed)      │
│                                             │
│ 3. At 100% Usage (Blocking)                 │
│    └─ BLOCK all new uploads                 │
│    └─ Send urgent email                     │
│    └─ Recommend upgrade/cleanup             │
│    └─ Return 403 Forbidden on upload        │
│                                             │
│ 4. Deletion (Frees Space)                   │
│    └─ Remove from S3                        │
│    └─ Update DB record                      │
│    └─ Recalculate usage                     │
│    └─ May re-enable uploads if <100%        │
└─────────────────────────────────────────────┘
```

---

## 8️⃣ AUTHENTICATION & JWT FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Authentication & JWT Token Flow                           │
└─────────────────────────────────────────────────────────────────────────────┘

LOGIN FLOW:
─────────

  User Login Page
       │
       ├─ Email: user@example.com
       ├─ Password: MySecurePass123
       └─ [LOGIN BUTTON]
            │
            ▼
  POST /auth/login
       │
       ├─ Find User by Email
       │
       ├─ Verify Password
       │  (bcrypt.compare)
       │
       ├─ Generate Access Token (24h)
       │  JWT.sign({
       │    sub: user_id,
       │    workspace_id,
       │    role,
       │    permissions
       │  }, secret, 24h)
       │
       ├─ Generate Refresh Token (7d)
       │  JWT.sign({
       │    sub: user_id,
       │    type: 'refresh'
       │  }, refresh_secret, 7d)
       │
       └─ Return Tokens
            │
            ▼
  {
    user: {...},
    access_token: "eyJhbGc...",
    refresh_token: "eyJhbGc...",
    expires_in: 86400
  }
            │
            ▼
  Store in Client:
  ├─ access_token → Memory/SessionStorage
  ├─ refresh_token → HttpOnly Cookie
  └─ Redirect to Dashboard

PROTECTED REQUEST FLOW:
──────────────────────

  API Request (GET /api/v1/content)
       │
       ├─ Headers: {
       │    Authorization: "Bearer {access_token}"
       │  }
       │
       ▼
  Express Middleware
       │
       ├─ Extract token from Authorization header
       │
       ├─ JWT.verify(token, secret)
       │  ├─ Check Signature
       │  ├─ Check Expiration
       │  └─ Extract Payload
       │
       ├─ If valid → Attach req.user = payload
       │             Continue ▼
       │
       ├─ If expired → Try Refresh Token
       │               (see below)
       │
       └─ If invalid → Return 401 Unauthorized

REFRESH TOKEN FLOW:
──────────────────

  Access Token Expired
       │
       ▼
  POST /auth/refresh
       │
       ├─ Body: { refresh_token }
       │
       ├─ JWT.verify(refresh_token, refresh_secret)
       │
       ├─ Generate new Access Token
       │  JWT.sign({...}, secret, 24h)
       │
       ├─ Generate new Refresh Token
       │  JWT.sign({...}, refresh_secret, 7d)
       │
       └─ Return new tokens
            │
            ▼
  Client updates tokens locally
            │
            ▼
  Retry original request
  with new access_token


TOKEN STRUCTURE:
────────────────

Access Token Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Access Token Payload:
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",    // User ID
  "workspace_id": "550e8400-e29b-41d4-a716-446655440001",
  "role": "admin",
  "permissions": [
    "content:create",
    "content:edit",
    "team:manage",
    ...
  ],
  "iat": 1627649000,
  "exp": 1627735400,
  "iss": "creatorops"
}

Access Token Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "your-secret-key"
)


LOGOUT FLOW:
───────────

  User clicks Logout
       │
       ▼
  POST /auth/logout
       │
       ├─ Remove access_token from client
       │
       ├─ Clear refresh_token cookie
       │
       ├─ Optional: Add token to blacklist (Redis)
       │
       └─ Redirect to Login Page

SECURITY:
─────────
✅ Passwords hashed with bcrypt (salt rounds: 10)
✅ Access tokens expire every 24 hours
✅ Refresh tokens expire every 7 days
✅ JWT verified on every protected request
✅ Tokens contain workspace_id for multi-tenancy
✅ Permissions stored in token for quick validation
✅ HttpOnly cookies protect refresh tokens
✅ HTTPS enforced in production
```

---

## 9️⃣ DATABASE SCHEMA RELATIONSHIP DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Database Schema Relationships (Simplified)                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    USERS     │
├──────────────┤
│ user_id (PK) │◄────┐
│ email        │     │
│ password_    │     │
│ full_name    │     │
│ ...          │     │ 1
└──────────────┘     │
       │             │
       │             │
       │        ┌────────────────┐
       │        │  WORKSPACES    │
       │        ├────────────────┤
       │        │ workspace_id   │
       │        │ owner_id (FK)  │◄──┐
       │        │ name           │   │
       │        │ slug           │   │
       │        │ ...            │   │
       │        └────────────────┘   │
       │             │               │
       │       ┌─────┴─────┐         │
       │       │ 1        N│         │
       │       │           │         │
       │  ┌────▼────────────▼─────┐  │
       │  │   TEAM_MEMBERS        │  │
       │  ├───────────────────────┤  │
       │  │ member_id (PK)        │  │
       │  │ workspace_id (FK)     │──┘
       │  │ user_id (FK)          │◄──┐
       │  │ role_id (FK)          │   │
       │  │ ...                   │   │
       │  └───────────────────────┘   │
       │                              │
       └──────────────────────────────┘
                    1


┌──────────────┐         ┌──────────────┐
│    ROLES     │         │  PERMISSIONS │
├──────────────┤         ├──────────────┤
│ role_id (PK) │────┐    │ permission_id│
│ workspace_id │    │    │ (PK)         │
│ name         │    │    │ name         │
│ permissions  │    │    │ description  │
│ ...          │    │    │ ...          │
└──────────────┘    │    └──────────────┘
                    │
                    └─ JSON field storing
                       permission keys


┌────────────────────┐
│   CONTENT          │
├────────────────────┤
│ content_id (PK)    │
│ workspace_id (FK)  │◄──┐
│ brand_id (FK)      │   │
│ title              │   │
│ current_stage_id   │   │
│ (FK to stages)     │   │
│ assigned_to (FK)   │   │
│ created_by (FK)    │   │
│ ...                │   │
└────────────────────┘   │ Creates
       │                 │
       │ Makes           │
       │                 │
  ┌────▼──────────────┐  │
  │   TASKS           │  │
  ├───────────────────┤  │
  │ task_id (PK)      │  │
  │ workspace_id (FK) │──┤
  │ content_id (FK)   │◄─┘
  │ assigned_to (FK)  │
  │ created_by (FK)   │
  │ ...               │
  └───────────────────┘


┌──────────────────────┐
│  WORKFLOW_STAGES     │
├──────────────────────┤
│ stage_id (PK)        │
│ workspace_id (FK)    │
│ name                 │
│ order_index          │
│ is_custom            │
│ ...                  │
└──────────────────────┘


┌──────────────────────┐
│  WORKFLOW_ROLES      │
├──────────────────────┤
│ workflow_role_id (PK)│
│ workspace_id (FK)    │
│ name                 │
│ is_custom            │
│ ...                  │
└──────────────────────┘


┌────────────────────┐
│   STORAGE          │
├────────────────────┤
│ storage_id (PK)    │
│ workspace_id (FK)  │
│ content_id (FK)    │
│ file_name          │
│ file_size_bytes    │
│ s3_key             │
│ s3_url             │
│ ...                │
└────────────────────┘


┌──────────────────────┐
│  STORAGE_USAGE       │
├──────────────────────┤
│ usage_id (PK)        │
│ workspace_id (FK/UQ) │
│ total_used_bytes     │
│ file_count           │
│ storage_limit_bytes  │
│ ...                  │
└──────────────────────┘


┌──────────────────────┐
│   SUBSCRIPTIONS      │
├──────────────────────┤
│ subscription_id (PK) │
│ workspace_id (FK/UQ) │
│ plan_type            │
│ status               │
│ storage_limit_gb     │
│ team_member_limit    │
│ brand_limit          │
│ ...                  │
└──────────────────────┘


KEY RELATIONSHIPS:
─────────────────
- 1 User → Many Workspaces (as owner)
- 1 Workspace → Many Team Members
- 1 Workspace → Many Content Items
- 1 Workspace → Many Tasks
- 1 Content → Many Tasks
- 1 Workspace → 1 Subscription
- 1 Workspace → 1 Storage Usage

DATA ISOLATION:
───────────────
ALL queries include: WHERE workspace_id = ?
No cross-workspace data access
```

---

## 🔟 API REQUEST-RESPONSE CYCLE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   API Request-Response Cycle (End-to-End)                    │
└─────────────────────────────────────────────────────────────────────────────┘

CLIENT (React/React Native)
    │
    ├─ 1. User Action (e.g., Create Content)
    │     └─ Click "Add Content" Button
    │
    ├─ 2. Prepare Request
    │     POST /api/v1/workspaces/{workspace_id}/content
    │     Headers: {
    │       Authorization: "Bearer {access_token}",
    │       Content-Type: "application/json"
    │     }
    │     Body: {
    │       title: "YouTube Intro Guide",
    │       description: "...",
    │       priority: "high",
    │       due_date: "2026-04-01",
    │       ...
    │     }
    │
    ▼
SERVER (Express.js)
    │
    ├─ 3. Receive Request
    │
    ├─ 4. CORS Middleware
    │     └─ Check allowed origins
    │
    ├─ 5. Body Parser Middleware
    │     └─ Parse JSON body
    │
    ├─ 6. Auth Middleware
    │     ├─ Extract token from Authorization header
    │     ├─ JWT.verify(token)
    │     └─ Attach req.user = payload
    │
    ├─ 7. Multi-tenancy Middleware
    │     ├─ Extract workspace_id from URL
    │     ├─ Validate user has access to workspace
    │     └─ Set req.workspace_id
    │
    ├─ 8. Validation Middleware
    │     ├─ Validate request body (Joi schema)
    │     ├─ Check required fields
    │     ├─ Validate data types
    │     └─ Return 400 if validation fails
    │
    ├─ 9. Router Handler
    │     └─ Route request to controller
    │
    ├─ 10. Controller (content.controller.js)
    │      ├─ Extract parameters
    │      ├─ Call service method
    │      └─ Handle response
    │
    ├─ 11. Service Layer (content.service.js)
    │      ├─ Check permission (PermissionService)
    │      ├─ Get initial stage ("Idea")
    │      ├─ Validate brands (if applicable)
    │      ├─ Create content record in DB
    │      ├─ Log activity
    │      └─ Return created content
    │
    ├─ 12. Database Query
    │      ├─ INSERT INTO content (...)
    │      ├─ INSERT INTO activity_logs (...)
    │      └─ SELECT * FROM workflows_stages WHERE...
    │
    ├─ 13. Background Job (optional)
    │      └─ Queue notification job
    │           └─ Send "Content Created" notification
    │
    ├─ 14. Response Construction
    │      {
    │        success: true,
    │        data: {
    │          content_id: "...",
    │          title: "YouTube Intro Guide",
    │          stage: "Idea",
    │          status: "draft",
    │          created_at: "2026-03-24T10:30:00Z"
    │        }
    │      }
    │
    ├─ 15. Status Code
    │      └─ 201 Created (if success)
    │         OR
    │         400 Bad Request (if validation failed)
    │         401 Unauthorized (if not authenticated)
    │         403 Forbidden (if no permission)
    │         500 Server Error (if exception)
    │
    ▼
CLIENT (React/React Native)
    │
    ├─ 16. Receive Response
    │      └─ Parse JSON
    │
    ├─ 17. Update State Management
    │      └─ Redux: dispatch(addContent(...))
    │         OR
    │         Zustand: setState(...)
    │
    ├─ 18. Update UI
    │      ├─ Add content to Kanban board
    │      ├─ Update content list
    │      └─ Trigger re-render
    │
    ├─ 19. Show Feedback
    │      └─ Toast notification: "Content created successfully"
    │
    └─ 20. Ready for Next Action
         └─ User can now edit or move content

ERROR HANDLING CYCLE:
────────────────────

If Error Occurs (e.g., Validation Failed):
    │
    ├─ Catch Exception in Service
    │
    ├─ Controller catches error
    │     └─ Format error response
    │
    ├─ Return Error Response
    │     {
    │       success: false,
    │       error: {
    │         code: "VALIDATION_ERROR",
    │         message: "Title is required",
    │         details: [{field: "title", ...}]
    │       }
    │     }
    │
    ├─ Status Code: 400 Bad Request
    │
    ├─ Client receives error
    │
    ├─ Show error message to user
    │     └─ Toast: "Title is required"
    │
    └─ User can retry


RESPONSE STATUS CODES:
─────────────────────

200 OK               → GET/PUT/PATCH succeeded
201 Created          → POST succeeded (resource created)
204 No Content       → DELETE succeeded (no response body)
400 Bad Request      → Validation error / Invalid input
401 Unauthorized     → Not authenticated / Token invalid
403 Forbidden        → Authenticated but no permission
404 Not Found        → Resource not found
409 Conflict         → Resource conflict (e.g., duplicate slug)
429 Too Many Requests→ Rate limit exceeded
500 Server Error     → Unhandled exception
503 Service Down     → Database unavailable
```

---

## 1️⃣1️⃣ CONTENT WORKFLOW STATE TRANSITIONS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│             Content Workflow State Transitions & Permissions                  │
└─────────────────────────────────────────────────────────────────────────────┘

                        START: DRAFT Status
                             │
                             ▼
        ┌────────────────────────────────────┐
        │ IDEA Stage (Draft)                  │
        │                                    │
        │ ├─ Capture idea                    │
        │ ├─ Add description                 │
        │ ├─ Set priority                    │
        │ └─ Change to In Progress (50%)     │
        │                                    │
        │ Who Can Edit:                      │
        │ ├─ Admin ✅                        │
        │ ├─ Content Manager ✅              │
        │ ├─ Creator/Owner ✅                │
        │ └─ Others ❌                       │
        │                                    │
        │ Who Can Move:                      │
        │ ├─ Admin ✅                        │
        │ └─ Content Manager ✅              │
        └────────────┬─────────────────────┘
                     │
         ┌───────────┴───────────┐
         │ (Approve & Route)     │
         │ Move → Script Stage   │
         │                       │
         ▼                       ▼
┌────────────────────┐   ┌──────────────┐
│ SCRIPT Stage       │   │ SCRIPT Stage │
│ (In Progress)      │   │ (Revised)    │
│                    │   │              │
│ ├─ Write scripts   │   │ Script       │
│ ├─ Add details     │   │ revisions    │
│ ├─ Add notes       │   │ received     │
│ │                  │   │              │
│ │ Who Can Edit:    │   │ Auto Move to:│
│ │ ├─ Admin ✅      │   │ Script       │
│ │ ├─ (Script       │   │ Stage+       │
│ │ │  Writer ONLY)  │   │              │
│ │ └─ Others ❌     │   │ Notify:      │
│ │                  │   │ Next Person  │
│ │ Who Can Move:    │   │              │
│ │ ├─ Admin ✅      │   │              │
│ │ ├─ Content       │   │              │
│ │ │  Manager ✅    │   │              │
│ │ └─ Script        │   │              │
│ │    Writer ❌     │   │              │
│ └────────┬─────────┘   └──────────────┘
│          │
│    ┌─────┴─────┐
│    │ (Approve) │
│    │           │
│    ▼           ▼
│ ┌────────────────────┐
│ │ SHOOT Stage        │
│ │ (In Progress)      │
│ │                    │
│ │ ├─ Record video    │
│ │ ├─ Take photos     │
│ │ ├─ Capture audio   │
│ │ │                  │
│ │ │ Who Can Edit:    │
│ │ │ ├─ Admin ✅      │
│ │ │ ├─ (Production   │
│ │ │ │  Team ONLY)    │
│ │ │ └─ Others ❌     │
│ │ │                  │
│ │ │ Who Can Move:    │
│ │ │ ├─ Admin ✅      │
│ │ │ ├─ Content       │
│ │ │ │  Manager ✅    │
│ │ │ └─ Prod Team ❌  │
│ │ └────────┬─────────┘
│ │          │
│ │    ┌─────┴──────┐
│ │    │ (Approve) │
│ │    │           │
│ │    ▼           ▼
│ │ ┌────────────────────┐
│ │ │ EDIT Stage         │
│ │ │ (In Progress)      │
│ │ │                    │
│ │ │ ├─ Edit video      │
│ │ │ ├─ Color grade     │
│ │ │ ├─ Add music       │
│ │ │ │                  │
│ │ │ │ Who Can Edit:    │
│ │ │ │ ├─ Admin ✅      │
│ │ │ │ ├─ Editor ✅     │
│ │ │ │ └─ Others ❌     │
│ │ │ │                  │
│ │ │ │ Who Can Move:    │
│ │ │ │ ├─ Admin ✅      │
│ │ │ │ ├─ Content Mgr ✅│
│ │ │ │ └─ Editor ❌     │
│ │ │ └────────┬─────────┘
│ │ │          │
│ │ │    ┌─────┴──────┐
│ │ │    │ (Approve) │
│ │ │    │           │
│ │ │    ▼           ▼
│ │ │ ┌────────────────────┐
│ │ │ │ UPLOAD Stage       │
│ │ │ │ (In Progress)      │
│ │ │ │                    │
│ │ │ │ ├─ Upload files    │
│ │ │ │ ├─ Verify upload   │
│ │ │ │ ├─ Store links     │
│ │ │ │ │                  │
│ │ │ │ │ Who Can Edit:    │
│ │ │ │ │ ├─ Admin ✅      │
│ │ │ │ │ ├─ Uploader ✅   │
│ │ │ │ │ └─ Others ❌     │
│ │ │ │ │                  │
│ │ │ │ │ Permission:      │
│ │ │ │ │ REQUIRES Manager │
│ │ │ │ │ approval before  │
│ │ │ │ │ moving SEO       │
│ │ │ │ └────────┬─────────┘
│ │ │ │          │
│ │ │ │          ▼
│ │ │ │ ┌────────────────────┐
│ │ │ │ │ SEO Stage          │
│ │ │ │ │ (In Progress)      │
│ │ │ │ │                    │
│ │ │ │ │ ├─ Add keywords    │
│ │ │ │ │ ├─ Meta tags       │
│ │ │ │ │ ├─ Descriptions    │
│ │ │ │ │ │                  │
│ │ │ │ │ │ Who Can Edit:    │
│ │ │ │ │ │ ├─ Admin ✅      │
│ │ │ │ │ │ ├─ SEO Manager ✅│
│ │ │ │ │ │ └─ Others ❌     │
│ │ │ │ │ │                  │
│ │ │ │ │ │ Who Can Move:    │
│ │ │ │ │ │ ├─ Admin ✅      │
│ │ │ │ │ │ ├─ Content Mgr ✅│
│ │ │ │ │ │ └─ SEO Mgr:      │
│ │ │ │ │ │    (Mark Ready) ✅
│ │ │ │ │ └────────┬─────────┘
│ │ │ │ │          │
│ │ │ │ │    ┌─────┴──────────┐
│ │ │ │ │    │ (Mark Ready)   │
│ │ │ │ │    │                │
│ │ │ │ │    ▼                ▼
│ │ │ │ │ ┌────────────────────┐
│ │ │ │ │ │ PUBLISH Stage      │
│ │ │ │ │ │ (Completed Status) │
│ │ │ │ │ │                    │
│ │ │ │ │ │ ├─ Set live date   │
│ │ │ │ │ │ ├─ Publish content │
│ │ │ │ │ │ ├─ Share links     │
│ │ │ │ │ │ │                  │
│ │ │ │ │ │ │ Who Can Move:    │
│ │ │ │ │ │ │ ├─ Admin ✅      │
│ │ │ │ │ │ │ └─ Content Mgr ✅│
│ │ │ │ │ │ └────────┬─────────┘
│ │ │ │ │ │          │
│ │ │ │ │ │     ┌────┴────┐
│ │ │ │ │ │     │ (Auto)  │
│ │ │ │ │ │     │         │
│ │ │ │ │ │     ▼         ▼
│ │ │ │ │ │ ┌────────────────────┐
│ │ │ │ │ │ │ REVENUE Stage      │
│ │ │ │ │ │ │ (Final)            │
│ │ │ │ │ │ │                    │
│ │ │ │ │ │ │ ├─ Track earnings  │
│ │ │ │ │ │ │ ├─ Monitor stats   │
│ │ │ │ │ │ │ ├─ Analyze ROI     │
│ │ │ │ │ │ │                    │
│ │ │ │ │ │ │ Who Can Edit:      │
│ │ │ │ │ │ │ ├─ Admin ✅        │
│ │ │ │ │ │ │ ├─ Content Mgr ✅  │
│ │ │ │ │ │ │ └─ Others (read)   │
│ │ │ │ │ │ └────────┬───────────┘
│ │ │ │ │ │          │
│ │ │ │ │ │          ▼
└─────────────────────────────────────────────
                  END: COMPLETE
                  Content Cycle Done
                  Ready for Archive
```

---

This comprehensive diagram documentation covers all major system components. Would you like me to also create diagrams for:
- Frontend Component Tree
- Data Flow Diagrams
- Sequence Diagrams (Interactions)
- Entity Relationship Diagrams (ERD)
- Deployment Architecture
- More specific flows?

