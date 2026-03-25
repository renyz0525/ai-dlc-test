# Customer Frontend - Code Generation Plan

## Unit Context
- **Unit**: customer-frontend
- **Workspace Root**: /Users/yongzher/Desktop/ai-dlc-test-customer-fe
- **Project Type**: Greenfield (multi-unit, microservices pattern)
- **Code Location**: Workspace root (customer-frontend project is this workspace)
- **Tech Stack**: Vue 3 + Vite 5 + TypeScript 5 + TailwindCSS 3 + PrimeVue 4 (Styled/Aura) + Vuex 4
- **Mock Strategy**: Vuex Mock Data with `VITE_USE_MOCK` env toggle
- **Test Stack**: Vitest + @vue/test-utils + @testing-library/vue

## Stories Covered
| Story | Name | Priority |
|---|---|---|
| US-C01 | Table Tablet Auto Login | High |
| US-C02 | Menu Browsing | High |
| US-C03 | Cart Management | High |
| US-C04 | Order Creation | High |
| US-C05 | Order History | Medium |

## Dependencies
- **Backend API**: Not yet available. Using Mock Data (`VITE_USE_MOCK=true`)
- **API Contract**: Based on OpenAPI spec from Application Design (component-methods.md)

---

## Code Generation Steps

### Phase A: Project Setup & Configuration

- [x] **Step 1**: Project Scaffold - Vite + Vue 3 + TypeScript 초기화
  - `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
  - Dependencies install configuration

- [x] **Step 2**: TailwindCSS + PostCSS 설정
  - `tailwind.config.js`, `postcss.config.js`
  - `src/assets/main.css` (Tailwind directives)

- [x] **Step 3**: PrimeVue 설정
  - `src/main.ts` (PrimeVue plugin, Aura theme, required components)

- [x] **Step 4**: Environment 설정
  - `.env.development` (VITE_USE_MOCK=true, VITE_API_BASE_URL)
  - `.env.production` (VITE_USE_MOCK=false, VITE_API_BASE_URL)

### Phase B: TypeScript Types & API Layer

- [x] **Step 5**: TypeScript 타입 정의
  - `src/types/index.ts` (AuthState, Menu, Category, CartItem, Order, OrderItem, OrderStatus, SSE events, UI state)

- [x] **Step 6**: API Client (fetch wrapper)
  - `src/api/client.ts` (ApiClient class, auth interceptor, error classes)

- [x] **Step 7**: Mock Data 정의
  - `src/api/mock/data.ts` (categories, menus, orders sample data)
  - `src/api/mock/auth.ts` (mock login response)
  - `src/api/mock/menu.ts` (mock menu responses)
  - `src/api/mock/order.ts` (mock order responses)

- [x] **Step 8**: API 모듈 (Mock/Real 분기)
  - `src/api/auth.ts` (login with mock branch)
  - `src/api/menu.ts` (fetchMenus with mock branch)
  - `src/api/order.ts` (createOrder, fetchOrders with mock branch)

- [x] **Step 9**: SSE Manager
  - `src/api/sse.ts` (SSEManager class, auto-reconnect, event handling)

- [x] **Step 10**: API Layer Unit Tests
  - `tests/unit/api/client.test.ts`
  - `tests/unit/api/menu.test.ts`
  - `tests/unit/api/order.test.ts`

### Phase C: Vuex Store Modules

- [x] **Step 11**: Auth Store Module
  - `src/store/modules/auth.ts` (state, mutations, actions: autoLogin, login, logout, loadCredentials)
  - **Stories**: US-C01

- [x] **Step 12**: Menu Store Module
  - `src/store/modules/menu.ts` (state, mutations, actions: fetchMenus, getters: filteredMenus, sortedCategories)
  - **Stories**: US-C02

- [x] **Step 13**: Cart Store Module
  - `src/store/modules/cart.ts` (state, mutations, actions: addItem, removeItem, updateQuantity, clearCart, loadFromStorage, persistToStorage)
  - **Stories**: US-C03

- [x] **Step 14**: Order Store Module
  - `src/store/modules/order.ts` (state, mutations, actions: createOrder, fetchOrders, updateOrderStatus)
  - **Stories**: US-C04, US-C05

- [x] **Step 15**: SSE Store Module
  - `src/store/modules/sse.ts` (state, mutations, actions: connect, disconnect, handleEvent)
  - **Stories**: US-C05

- [x] **Step 16**: UI Store Module
  - `src/store/modules/ui.ts` (state, mutations, actions: toggleCartPanel, showToast, hideToast)

- [x] **Step 17**: Vuex Store Index + Persistence Plugin
  - `src/store/index.ts` (createStore with all modules)
  - `src/store/plugins/persistence.ts` (localStorage sync)

- [x] **Step 18**: Store Unit Tests
  - `tests/unit/store/auth.test.ts`
  - `tests/unit/store/menu.test.ts`
  - `tests/unit/store/cart.test.ts`
  - `tests/unit/store/order.test.ts`

### Phase D: Router & Utilities

- [x] **Step 19**: Vue Router 설정
  - `src/router/index.ts` (routes, navigation guard with auto-login)
  - **Stories**: US-C01 (auth guard)

- [x] **Step 20**: Utility Functions
  - `src/utils/format.ts` (formatPrice, formatDate)
  - `src/utils/network.ts` (setupNetworkDetection)

- [x] **Step 21**: Composables
  - `src/composables/useBreakpoint.ts` (responsive breakpoint detection)

- [x] **Step 22**: Utility Unit Tests
  - `tests/unit/utils/format.test.ts`
  - `tests/unit/utils/network.test.ts`

### Phase E: Common Components

- [x] **Step 23**: App Layout & Header
  - `src/App.vue` (root component)
  - `src/components/common/AppLayout.vue` (authenticated layout)
  - `src/components/common/AppHeader.vue` (header with cart badge, order history link)

- [x] **Step 24**: Shared UI Components
  - `src/components/common/StatusBadge.vue` (order status badge)
  - `src/components/common/PaginationBar.vue` (page navigation)

### Phase F: Feature Views & Components

- [x] **Step 25**: SetupView (US-C01)
  - `src/views/SetupView.vue` (initial tablet config form)

- [x] **Step 26**: MenuView + Menu Components (US-C02)
  - `src/views/MenuView.vue` (menu page with sidebar/dropdown layout)
  - `src/components/menu/CategorySidebar.vue` (desktop/tablet sidebar)
  - `src/components/menu/CategoryDropdown.vue` (mobile dropdown)
  - `src/components/menu/MenuGrid.vue` (responsive grid)
  - `src/components/menu/MenuCard.vue` (menu item card with add button)

- [x] **Step 27**: Cart Components (US-C03)
  - `src/components/cart/CartSlidePanel.vue` (right slide panel using PrimeVue Sidebar)
  - `src/components/cart/CartItemCard.vue` (item with quantity controls)

- [x] **Step 28**: OrderConfirmView (US-C04)
  - `src/views/OrderConfirmView.vue` (order review + confirm button)
  - `src/components/order/OrderSummaryList.vue` (order items list)

- [x] **Step 29**: OrderSuccessView (US-C04)
  - `src/views/OrderSuccessView.vue` (success + 5s countdown + auto redirect)

- [x] **Step 30**: OrderHistoryView (US-C05)
  - `src/views/OrderHistoryView.vue` (paginated order list + SSE)
  - `src/components/order/OrderCard.vue` (order display card)

- [x] **Step 31**: Feature Component Tests
  - `tests/components/SetupView.test.ts`
  - `tests/components/MenuView.test.ts`
  - `tests/components/CartSlidePanel.test.ts`
  - `tests/components/OrderConfirmView.test.ts`
  - `tests/components/OrderHistoryView.test.ts`

### Phase G: Configuration & Documentation

- [x] **Step 32**: Vitest 설정
  - `vitest.config.ts` (test configuration)

- [x] **Step 33**: Code Generation Summary
  - `aidlc-docs/construction/customer-frontend/code/code-generation-summary.md`

---

## Story Traceability

| Story | Steps |
|---|---|
| US-C01 (Auto Login) | Step 11, 19, 25 |
| US-C02 (Menu Browse) | Step 12, 26 |
| US-C03 (Cart) | Step 13, 27 |
| US-C04 (Order Create) | Step 14, 28, 29 |
| US-C05 (Order History) | Step 14, 15, 30 |

## Generation Rules
- All interactive elements include `data-testid` attributes
- Mock data used when `VITE_USE_MOCK=true`
- All Korean text hard-coded (no i18n)
- PrimeVue Styled Mode (Aura theme)
- TailwindCSS for layout/spacing
- Responsive: mobile dropdown + tablet/desktop sidebar
