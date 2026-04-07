# CreatorOps - Frontend Architecture & Development Plan

## 📱 Frontend Tech Stack

### Web Frontend (React)
```
├─ Framework: React 18.x
├─ Build Tool: Create React App or Vite
├─ State Management: Redux Toolkit or Zustand
├─ HTTP Client: Axios
├─ Styling: Tailwind CSS or Material-UI
├─ Form Management: React Hook Form or Formik
├─ Routing: React Router v6
├─ Real-time Updates: Socket.io-client or WebSocket
├─ Date Management: Day.js or date-fns
├─ Charts: Recharts or Chart.js
├─ Notifications: React Toastify or Notistack
└─ Testing: Jest, React Testing Library, Cypress
```

### Mobile Frontend (React Native)
```
├─ Framework: React Native (v0.72+)
├─ Navigation: React Native Navigation or React Navigation
├─ State Management: Redux Toolkit or Zustand
├─ HTTP Client: Axios
├─ UI Components: React Native Paper or Native Base
├─ Storage: AsyncStorage
├─ Notifications: React Native Firebase Cloud Messaging
├─ Testing: Jest, React Native Testing Library
└─ Build: Expo or React Native CLI
```

---

## 🏗️ Web Frontend (React) Folder Structure

```
creatorops-web/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── components/                # Reusable components
│   │   ├── common/
│   │   │   ├── Header/           # Top navigation bar
│   │   │   ├── Sidebar/          # Left sidebar navigation
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Loader/
│   │   │   ├── ErrorBoundary/
│   │   │   └── Toast/
│   │   │
│   │   ├── auth/                 # Auth-related components
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   ├── ForgotPasswordForm/
│   │   │   ├── ResetPasswordForm/
│   │   │   └── ProtectedRoute/
│   │   │
│   │   ├── dashboard/            # Dashboard components
│   │   │   ├── OverviewWidget/
│   │   │   ├── TaskWidget/
│   │   │   ├── PipelineChart/
│   │   │   └── ActivityFeed/
│   │   │
│   │   ├── production-board/     # Production board components
│   │   │   ├── KanbanBoard/
│   │   │   ├── ContentCard/
│   │   │   ├── ListView/
│   │   │   ├── CalendarView/
│   │   │   ├── TimelineView/
│   │   │   ├── FilterPanel/
│   │   │   └── SearchBar/
│   │   │
│   │   ├── content/              # Content management
│   │   │   ├── CreateContentModal/
│   │   │   ├── EditContentModal/
│   │   │   ├── ContentDetails/
│   │   │   ├── ContentComments/
│   │   │   └── ContentHistory/
│   │   │
│   │   ├── tasks/                # Task components
│   │   │   ├── TaskList/
│   │   │   ├── TaskCard/
│   │   │   ├── TaskDetail/
│   │   │   └── TaskForm/
│   │   │
│   │   ├── team/                 # Team management
│   │   │   ├── TeamMemberList/
│   │   │   ├── MemberCard/
│   │   │   ├── InviteForm/
│   │   │   ├── RoleManager/
│   │   │   └── PermissionEditor/
│   │   │
│   │   ├── storage/              # Storage management
│   │   │   ├── StorageUsage/
│   │   │   ├── FileUploader/
│   │   │   ├── FileList/
│   │   │   └── StorageStats/
│   │   │
│   │   ├── analytics/            # Analytics components
│   │   │   ├── RevenueChart/
│   │   │   ├── CostChart/
│   │   │   ├── PipelineMetrics/
│   │   │   └── TeamMetrics/
│   │   │
│   │   ├── settings/             # Settings components
│   │   │   ├── WorkspaceSettings/
│   │   │   ├── BillingSettings/
│   │   │   ├── SecuritySettings/
│   │   │   └── NotificationSettings/
│   │   │
│   │   └── onboarding/           # Onboarding components
│   │       ├── WorkspaceTypeStep/
│   │       ├── BrandDetailsStep/
│   │       ├── TeamSizeStep/
│   │       ├── WorkflowRolesStep/
│   │       ├── WorkflowStagesStep/
│   │       ├── PublishingFreqStep/
│   │       └── NotificationPrefStep/
│   │
│   ├── pages/                    # Route pages (container components)
│   │   ├── auth/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── ForgotPasswordPage.js
│   │   │   └── ResetPasswordPage.js
│   │   │
│   │   ├── onboarding/
│   │   │   └── OnboardingFlow.js (7-step wizard)
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.js
│   │   │
│   │   ├── production-board/
│   │   │   └── ProductionBoardPage.js
│   │   │
│   │   ├── tasks/
│   │   │   └── TasksPage.js
│   │   │
│   │   ├── content/
│   │   │   └── ContentPage.js
│   │   │
│   │   ├── analytics/
│   │   │   ├── RevenueAnalyticsPage.js
│   │   │   ├── CostsAnalyticsPage.js
│   │   │   └── TeamAnalyticsPage.js
│   │   │
│   │   ├── team/
│   │   │   └── TeamManagementPage.js
│   │   │
│   │   ├── storage/
│   │   │   └── StorageManagementPage.js
│   │   │
│   │   ├── settings/
│   │   │   └── SettingsPage.js
│   │   │
│   │   └── 404/
│   │       └── NotFoundPage.js
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.js           # Auth context & hook
│   │   ├── useWorkspace.js      # Workspace context & hook
│   │   ├── useFetch.js          # API fetch hook
│   │   ├── useLocalStorage.js   # Local storage hook
│   │   ├── useNotification.js   # Toast notification hook
│   │   ├── useForm.js           # Form handling hook
│   │   ├── usePagination.js     # Pagination logic
│   │   └── useDebounce.js       # Debounce hook
│   │
│   ├── store/                   # Redux store (if using Redux)
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── workspaceSlice.js
│   │   │   ├── contentSlice.js
│   │   │   ├── tasksSlice.js
│   │   │   ├── teamSlice.js
│   │   │   ├── uiSlice.js
│   │   │   └── billingSlice.js
│   │   ├── store.js             # Redux store configuration
│   │   └── middleware/
│   │       └── api.middleware.js
│   │
│   ├── services/                # API service layer
│   │   ├── api.js               # Axios instance
│   │   ├── auth.service.js
│   │   ├── workspace.service.js
│   │   ├── content.service.js
│   │   ├── task.service.js
│   │   ├── team.service.js
│   │   ├── storage.service.js
│   │   ├── billing.service.js
│   │   └── analytics.service.js
│   │
│   ├── utils/                   # Utility functions
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js        # Format dates, currency, etc
│   │   ├── api.utils.js         # API helper functions
│   │   ├── error.utils.js       # Error handling
│   │   ├── file.utils.js        # File upload/download
│   │   ├── storage.utils.js     # Storage calculations
│   │   └── auth.utils.js        # JWT token management
│   │
│   ├── styles/                  # Global styles
│   │   ├── globals.css
│   │   ├── tailwind.css         # Tailwind config (if using)
│   │   ├── variables.css        # CSS variables
│   │   └── animations.css
│   │
│   ├── context/                 # React Context (if not using Redux)
│   │   ├── AuthContext.js
│   │   ├── WorkspaceContext.js
│   │   └── UIContext.js
│   │
│   ├── types/ or .d.ts/         # JSDoc type definitions
│   │   ├── models.js            # Data model types
│   │   ├── api.js               # API types
│   │   └── ui.js                # UI types
│   │
│   ├── config/                  # Configuration
│   │   ├── api.config.js
│   │   ├── app.config.js
│   │   └── feature.flags.js
│   │
│   ├── App.js                   # Main App component
│   ├── index.js                 # App entry point
│   └── index.css
│
├── tests/                       # Tests
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── __fixtures__/
│
├── public/
│   └── images/
│
├── .env.example
├── .eslintrc.js
├── .prettierrc.js
├── tailwind.config.js           # If using Tailwind
├── package.json
├── README.md
└── jest.config.js
```

---

## 📱 Mobile Frontend (React Native) Folder Structure

```
creatorops-mobile/
├── app/                         # Main app directory (Expo)
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── ForgotPasswordScreen.js
│   │   │   └── SplashScreen.js
│   │   │
│   │   ├── onboarding/
│   │   │   └── OnboardingFlow.js
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.js
│   │   │
│   │   ├── production-board/
│   │   │   ├── KanbanScreen.js
│   │   │   ├── ListScreen.js
│   │   │   └── CalendarScreen.js
│   │   │
│   │   ├── tasks/
│   │   │   ├── TasksListScreen.js
│   │   │   └── TaskDetailScreen.js
│   │   │
│   │   ├── content/
│   │   │   ├── ContentListScreen.js
│   │   │   ├── ContentDetailScreen.js
│   │   │   └── ContentFormScreen.js
│   │   │
│   │   ├── team/
│   │   │   └── TeamScreen.js
│   │   │
│   │   ├── settings/
│   │   │   └── SettingsScreen.js
│   │   │
│   │   └── profile/
│   │       └── ProfileScreen.js
│   │
│   ├── components/              # Reusable components
│   │   ├── common/
│   │   │   ├── HeaderBar/
│   │   │   ├── BottomTab/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Loader/
│   │   │   ├── Toast/
│   │   │   └── SafeArea/
│   │   │
│   │   ├── production-board/
│   │   │   ├── ContentCard/
│   │   │   ├── FilterPanel/
│   │   │   ├── SortOptions/
│   │   │   └── SearchBar/
│   │   │
│   │   └── content/
│   │       ├── ContentForm/
│   │       ├── ContentDetails/
│   │       └── AttachmentPicker/
│   │
│   ├── navigation/              # Navigation setup
│   │   ├── AuthNavigator.js
│   │   ├── MainNavigator.js
│   │   ├── RootNavigator.js
│   │   └── LinkingConfiguration.js
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useWorkspace.js
│   │   ├── useFetch.js
│   │   ├── useAsyncStorage.js
│   │   └── useNotification.js
│   │
│   ├── store/                   # Redux store
│   │   ├── slices/
│   │   ├── store.js
│   │   └── middleware/
│   │
│   ├── services/                # API services
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   └── [...other services]/
│   │
│   ├── utils/                   # Utilities
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── file.utils.js
│   │   └── error.utils.js
│   │
│   ├── styles/                  # Global styles
│   │   ├── colors.js
│   │   ├── fonts.js
│   │   ├── spacing.js
│   │   └── shadows.js
│   │
│   ├── context/                 # React Context
│   │   ├── AuthContext.js
│   │   └── WorkspaceContext.js
│   │
│   ├── types/                   # Type definitions
│   │   └── models.js
│   │
│   ├── config/                  # Configuration
│   │   └── api.config.js
│   │
│   ├── app.json                 # Expo config
│   └── App.js                   # Root component
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── __fixtures__/
│
├── .env.example
├── .eslintrc.js
├── package.json
├── app.json
└── README.md
```

---

## 🎨 Web Frontend Component Architecture

### Example: Production Board Component

```javascript
// pages/production-board/ProductionBoardPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import KanbanBoard from '../../components/production-board/KanbanBoard';
import ListView from '../../components/production-board/ListView';
import CalendarView from '../../components/production-board/CalendarView';
import TimelineView from '../../components/production-board/TimelineView';
import FilterPanel from '../../components/production-board/FilterPanel';
import SearchBar from '../../components/production-board/SearchBar';
import { fetchContent } from '../../store/slices/contentSlice';

const ProductionBoardPage = () => {
  const dispatch = useDispatch();
  const { content, loading } = useSelector(state => state.content);
  const [currentView, setCurrentView] = useState('kanban'); // kanban, list, calendar, timeline
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchContent({ filters, search: searchQuery }));
  }, [filters, searchQuery, dispatch]);

  const renderView = () => {
    switch (currentView) {
      case 'list':
        return <ListView content={content} />;
      case 'calendar':
        return <CalendarView content={content} />;
      case 'timeline':
        return <TimelineView content={content} />;
      case 'kanban':
      default:
        return <KanbanBoard content={content} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Production Board</h1>
            <div className="flex gap-2">
              {['kanban', 'list', 'calendar', 'timeline'].map(view => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-4 py-2 rounded ${
                    currentView === view
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-6 mb-6">
            <SearchBar query={searchQuery} onChange={setSearchQuery} />
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="bg-white rounded-lg shadow overflow-auto h-full">
              {renderView()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionBoardPage;
```

### Example: Content Service (API Layer)

```javascript
// services/content.service.js
import api from './api';

const contentService = {
  // Get all content for workspace
  getContent: async (workspaceId, filters = {}, pagination = {}) => {
    const response = await api.get(`/workspaces/${workspaceId}/content`, {
      params: { ...filters, ...pagination }
    });
    return response.data;
  },

  // Get single content
  getContentById: async (workspaceId, contentId) => {
    const response = await api.get(`/workspaces/${workspaceId}/content/${contentId}`);
    return response.data;
  },

  // Create new content
  createContent: async (workspaceId, data) => {
    const response = await api.post(`/workspaces/${workspaceId}/content`, data);
    return response.data;
  },

  // Update content
  updateContent: async (workspaceId, contentId, data) => {
    const response = await api.put(`/workspaces/${workspaceId}/content/${contentId}`, data);
    return response.data;
  },

  // Move to different stage
  moveToStage: async (workspaceId, contentId, stageId) => {
    const response = await api.patch(
      `/workspaces/${workspaceId}/content/${contentId}/stage`,
      { stage_id: stageId }
    );
    return response.data;
  },

  // Delete content
  deleteContent: async (workspaceId, contentId) => {
    const response = await api.delete(`/workspaces/${workspaceId}/content/${contentId}`);
    return response.data;
  },

  // Get content history
  getContentHistory: async (workspaceId, contentId) => {
    const response = await api.get(`/workspaces/${workspaceId}/content/${contentId}/history`);
    return response.data;
  },

  // Get comments
  getComments: async (workspaceId, contentId, pagination = {}) => {
    const response = await api.get(
      `/workspaces/${workspaceId}/content/${contentId}/comments`,
      { params: pagination }
    );
    return response.data;
  },

  // Add comment
  addComment: async (workspaceId, contentId, commentText) => {
    const response = await api.post(
      `/workspaces/${workspaceId}/content/${contentId}/comments`,
      { comment_text: commentText }
    );
    return response.data;
  }
};

export default contentService;
```

### Example: Auth Hook

```javascript
// hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import authService from '../services/auth.service';
import { setUser, setTokens, clearAuth } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, tokens, loading } = useSelector(state => state.auth);

  const login = useCallback(async (email, password) => {
    try {
      const { user, access_token, refresh_token } = await authService.login(email, password);
      dispatch(setUser(user));
      dispatch(setTokens({ access_token, refresh_token }));
      return user;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const register = useCallback(async (email, password, fullName, workspaceName) => {
    try {
      const { user, access_token, refresh_token } = await authService.register(
        email,
        password,
        fullName,
        workspaceName
      );
      dispatch(setUser(user));
      dispatch(setTokens({ access_token, refresh_token }));
      return user;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  return {
    user,
    tokens,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!tokens
  };
};

export default useAuth;
```

---

## 🔌 State Management (Redux Toolkit Example)

### Auth Slice

```javascript
// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth.service';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.access_token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

const initialState = {
  user: null,
  tokens: {
    access_token: localStorage.getItem('token'),
    refresh_token: localStorage.getItem('refresh_token')
  },
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setTokens: (state, action) => {
      state.tokens = action.payload;
      localStorage.setItem('token', action.payload.access_token);
      localStorage.setItem('refresh_token', action.payload.refresh_token);
    },
    clearAuth: (state) => {
      state.user = null;
      state.tokens = { access_token: null, refresh_token: null };
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = {
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setUser, setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

---

## 📋 Frontend Development Roadmap

### Phase 1: Auth & Setup (Week 1-2)
- [ ] Project setup (React, Redux, routing)
- [ ] Authentication pages (login, register, forgot password)
- [ ] Protected routes
- [ ] Token management

### Phase 2: Onboarding (Week 2-3)
- [ ] 7-step onboarding wizard
- [ ] Workspace creation
- [ ] Workflow configuration
- [ ] User preference settings

### Phase 3: Dashboard & Navigation (Week 3-4)
- [ ] Main dashboard layout
- [ ] Sidebar navigation
- [ ] Header with notifications
- [ ] Dashboard overview widgets

### Phase 4: Production Board (Week 4-6)
- [ ] Kanban view (drag & drop)
- [ ] List view (table with sorting)
- [ ] Calendar view
- [ ] Timeline/Gantt view
- [ ] Filters and search
- [ ] View switching

### Phase 5: Content Management (Week 6-7)
- [ ] Create/edit content modals
- [ ] Content detail view
- [ ] Stage transitions
- [ ] Comments and collaboration
- [ ] File upload

### Phase 6: Analytics & Team (Week 7-8)
- [ ] Revenue dashboard
- [ ] Costs dashboard
- [ ] Team management
- [ ] Role assignment
- [ ] Analytics charts

### Phase 7: Settings & Billing (Week 8-9)
- [ ] Workspace settings
- [ ] Billing page
- [ ] Subscription management
- [ ] Security settings

### Phase 8: Polish & Testing (Week 9-10)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] Bug fixes

### Phase 9: Mobile (React Native) (Week 10-12)
- [ ] Project setup
- [ ] Navigation structure
- [ ] Auth screens
- [ ] Dashboard screen
- [ ] Production board (simplified views)
- [ ] Task management
- [ ] Settings screen

---

## 🧪 Testing Strategy

### Unit Tests (Jest + React Testing Library)
```javascript
// __tests__/components/ProductionBoard.test.js
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ProductionBoardPage from '../../pages/production-board/ProductionBoardPage';
import store from '../../store/store';

describe('Production Board Page', () => {
  it('renders production board page', () => {
    render(
      <Provider store={store}>
        <ProductionBoardPage />
      </Provider>
    );
    expect(screen.getByText('Production Board')).toBeInTheDocument();
  });

  it('displays view toggle buttons', () => {
    render(
      <Provider store={store}>
        <ProductionBoardPage />
      </Provider>
    );
    expect(screen.getByText('Kanban')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
  });
});
```

### Integration Tests (Cypress)
```javascript
// cypress/integration/production-board.spec.js
describe('Production Board', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.get('a[href="/production-board"]').click();
  });

  it('loads content items', () => {
    cy.get('[data-testid="content-card"]').should('have.length.greaterThan', 0);
  });

  it('switches to list view', () => {
    cy.get('button:contains("List")').click();
    cy.get('table').should('be.visible');
  });

  it('filters content by stage', () => {
    cy.get('[data-testid="filter-panel"]').click();
    cy.get('input[value="script"]').check();
    cy.get('button:contains("Apply")').click();
  });
});
```

---

## 🎨 Styling Approach

### Option 1: Tailwind CSS + Custom CSS
```javascript
// styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom components */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors;
}
```

### Option 2: Material-UI
```javascript
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh'
  },
  content: {
    flex: 1,
    overflow: 'auto'
  }
}));
```

---

## 🔌 API Integration Pattern

```javascript
// services/api.js
import axios from 'axios';
import store from '../store/store';
import { refreshToken } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshed = await store.dispatch(refreshToken());
      if (refreshed) {
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 🚀 Build & Deployment

### Web Frontend
```bash
# Development
npm start

# Production build
npm run build

# Deploy to Vercel/Netlify
npm run deploy
```

### Mobile Frontend (React Native)
```bash
# iOS build
eas build --platform ios

# Android build
eas build --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

---

## 📦 Performance Optimization

1. **Code Splitting**: Lazy load pages and components
```javascript
import { lazy, Suspense } from 'react';
const ProductionBoard = lazy(() => import('./ProductionBoardPage'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductionBoard />
    </Suspense>
  );
}
```

2. **Image Optimization**: Use Next.js Image or similar
3. **State Management**: Use selectors to prevent unnecessary re-renders
4. **Memoization**: Use React.memo for expensive components
5. **Debouncing**: Search and filter inputs
6. **Virtual Scrolling**: For long lists
7. **Lazy Loading**: Intersection Observer for content

---

## 🔐 Security Best Practices

1. **Store tokens securely**
   - Use httpOnly cookies (if possible)
   - Avoid localStorage for sensitive data in production
   - Clear tokens on logout

2. **CSRF Protection**
   - Use CSRF tokens for state-changing requests
   - SameSite cookie attributes

3. **Input Validation**
   - Validate all user inputs
   - Sanitize HTML content
   - Use helmet.js for headers (if Node backend)

4. **XSS Prevention**
   - Escape user-generated content
   - Use content security headers
   - Avoid dangerouslySetInnerHTML

5. **HTTPS Only**
   - Enforce HTTPS in production
   - Use secure cookies

