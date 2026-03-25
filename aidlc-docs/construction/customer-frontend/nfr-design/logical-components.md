# Customer Frontend - Logical Components

## Component Architecture Overview

```
+-------------------------------------------------------------------+
|                        Browser (Client)                           |
+-------------------------------------------------------------------+
|                                                                   |
|  +---------------------+  +-----------------------------------+  |
|  |    Vue Router        |  |         Vuex Store                |  |
|  |  (Navigation Guard)  |  | +------+ +------+ +------+       |  |
|  +---------------------+  | | auth  | | menu | | cart |       |  |
|                            | +------+ +------+ +------+       |  |
|  +---------------------+  | +------+ +------+ +------+       |  |
|  |    Vue Components    |  | | order| | sse  | | ui   |       |  |
|  |  (Views + Shared)    |  | +------+ +------+ +------+       |  |
|  +---------------------+  +-----------------------------------+  |
|                                                                   |
|  +---------------------+  +-----------------------------------+  |
|  |   PrimeVue UI Kit   |  |         API Layer                 |  |
|  |  (Styled + Aura)    |  | +--------+ +--------+ +--------+ |  |
|  +---------------------+  | | client | | mock/  | | sse    | |  |
|                            | |(fetch) | | data   | |manager | |  |
|  +---------------------+  | +--------+ +--------+ +--------+ |  |
|  |   TailwindCSS       |  +-----------------------------------+  |
|  |  (Layout/Spacing)   |                                         |
|  +---------------------+  +-----------------------------------+  |
|                            |       Browser APIs                |  |
|                            | +------------+ +----------------+ |  |
|                            | | localStorage| | EventSource   | |  |
|                            | +------------+ +----------------+ |  |
|                            | +------------+ +----------------+ |  |
|                            | | navigator   | | window events | |  |
|                            | | .onLine     | | (resize, etc) | |  |
|                            | +------------+ +----------------+ |  |
|                            +-----------------------------------+  |
+-------------------------------------------------------------------+
                                    |
                                    | HTTP/SSE
                                    v
                          +-------------------+
                          |   Backend API     |
                          |  (Express.js)     |
                          +-------------------+
```

---

## Logical Component Inventory

### 1. Presentation Layer

| Component | Type | Purpose | Technology |
|---|---|---|---|
| Views (5) | Page Components | Full page rendering per route | Vue 3 SFC |
| Shared Components (8+) | Reusable UI | Buttons, cards, panels, badges | Vue 3 SFC |
| PrimeVue Components | UI Kit | Pre-built components (Toast, Dialog, Dropdown, Paginator, Sidebar, Button, Badge, Skeleton, InputText, Password) | PrimeVue 4 Styled Mode (Aura) |
| TailwindCSS | CSS Framework | Layout, spacing, responsive grid | TailwindCSS 3 |

### 2. State Management Layer

| Component | Purpose | Persistence |
|---|---|---|
| auth module | Authentication state (token, session, user info) | token: memory only, credentials: localStorage |
| menu module | Menu/category data | memory only (fetched on mount) |
| cart module | Cart items, totals | localStorage (bidirectional sync) |
| order module | Order list, pagination | memory only (fetched on mount) |
| sse module | SSE connection state | memory only |
| ui module | UI state (cart panel, toasts) | memory only |
| Persistence Plugin | Auto-sync Vuex <-> localStorage | localStorage |

### 3. API Communication Layer

| Component | Purpose | Protocol |
|---|---|---|
| ApiClient | HTTP request wrapper with auth interceptor | REST (fetch) |
| SSEManager | SSE connection lifecycle, auto-reconnect | EventSource |
| Mock Data | Hardcoded response data for pre-integration | In-memory |
| API Modules (auth, menu, order) | Domain-specific API functions with mock branch | REST |

### 4. Infrastructure Services (Browser)

| Component | Purpose | API |
|---|---|---|
| localStorage | Credential & cart persistence | Web Storage API |
| EventSource | Server-Sent Events connection | EventSource API |
| Network Detection | Online/offline status monitoring | Navigator.onLine + events |
| Window Resize | Responsive breakpoint detection | Window resize event |

### 5. Cross-Cutting Concerns

| Concern | Pattern | Implementation |
|---|---|---|
| Authentication | Navigation Guard + Auth Interceptor | Router beforeEach + ApiClient 401 handler |
| Error Handling | Centralized Toast + Per-module error state | PrimeVue Toast + Vuex error states |
| Network Resilience | Detection + Auto-recovery | online/offline events + SSE reconnect |
| State Persistence | Vuex Plugin | Subscribe to mutations -> localStorage |
| Responsive Design | Breakpoint-Adaptive | useBreakpoint composable + TailwindCSS |

---

## Component Communication Flow

```
User Interaction
      |
      v
Vue Component (emit event / call store action)
      |
      v
Vuex Store (dispatch action)
      |
      +---> API Layer (if server call needed)
      |         |
      |         +---> Mock Data (if VITE_USE_MOCK=true)
      |         |
      |         +---> ApiClient -> Backend API (if VITE_USE_MOCK=false)
      |         |
      |         v
      |    Response / Error
      |         |
      +<--------+
      |
      v
Vuex Mutation (update state)
      |
      +---> Persistence Plugin (sync to localStorage if applicable)
      |
      v
Vue Component (reactive UI update)
```

---

## File Structure (Final)

```
customer-frontend/
+-- public/
|   +-- favicon.ico
+-- src/
|   +-- api/
|   |   +-- client.ts          # Fetch wrapper with auth interceptor
|   |   +-- auth.ts            # Auth API (login)
|   |   +-- menu.ts            # Menu API (fetch menus)
|   |   +-- order.ts           # Order API (create, fetch)
|   |   +-- sse.ts             # SSE connection manager
|   |   +-- mock/
|   |       +-- data.ts        # Mock data definitions
|   |       +-- auth.ts        # Mock auth responses
|   |       +-- menu.ts        # Mock menu responses
|   |       +-- order.ts       # Mock order responses
|   +-- composables/
|   |   +-- useBreakpoint.ts   # Responsive breakpoint detection
|   +-- components/
|   |   +-- common/
|   |   |   +-- AppHeader.vue
|   |   |   +-- AppLayout.vue
|   |   |   +-- StatusBadge.vue
|   |   |   +-- PaginationBar.vue
|   |   +-- menu/
|   |   |   +-- CategorySidebar.vue
|   |   |   +-- CategoryDropdown.vue  # Mobile only
|   |   |   +-- MenuGrid.vue
|   |   |   +-- MenuCard.vue
|   |   +-- cart/
|   |   |   +-- CartSlidePanel.vue
|   |   |   +-- CartItemCard.vue
|   |   +-- order/
|   |       +-- OrderCard.vue
|   |       +-- OrderSummaryList.vue
|   +-- views/
|   |   +-- SetupView.vue
|   |   +-- MenuView.vue
|   |   +-- OrderConfirmView.vue
|   |   +-- OrderSuccessView.vue
|   |   +-- OrderHistoryView.vue
|   +-- store/
|   |   +-- index.ts            # Vuex store with persistence plugin
|   |   +-- modules/
|   |   |   +-- auth.ts
|   |   |   +-- menu.ts
|   |   |   +-- cart.ts
|   |   |   +-- order.ts
|   |   |   +-- sse.ts
|   |   |   +-- ui.ts
|   |   +-- plugins/
|   |       +-- persistence.ts  # localStorage sync plugin
|   +-- router/
|   |   +-- index.ts            # Routes + navigation guard
|   +-- types/
|   |   +-- index.ts            # TypeScript interfaces
|   +-- utils/
|   |   +-- format.ts           # Price formatting, date formatting
|   |   +-- network.ts          # Network detection setup
|   +-- App.vue
|   +-- main.ts
+-- tests/
|   +-- unit/
|   |   +-- store/              # Vuex module tests
|   |   +-- api/                # API layer tests
|   |   +-- utils/              # Utility function tests
|   +-- components/             # Component tests
+-- index.html
+-- package.json
+-- tsconfig.json
+-- vite.config.ts
+-- tailwind.config.js
+-- postcss.config.js
+-- .env.development            # VITE_USE_MOCK=true
+-- .env.production             # VITE_USE_MOCK=false
```
