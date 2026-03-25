# Customer Frontend - Frontend Components Design

## Component Hierarchy

```
App.vue
+-- AppLayout.vue (authenticated layout with header)
|   +-- AppHeader.vue
|   |   +-- Cart badge icon
|   |   +-- Order History link
|   +-- CartSlidePanel.vue (right slide panel)
|   |   +-- CartItemCard.vue (per item)
|   +-- <router-view>
|       +-- MenuView.vue
|       |   +-- CategorySidebar.vue
|       |   +-- MenuGrid.vue
|       |       +-- MenuCard.vue (per menu)
|       +-- OrderConfirmView.vue
|       |   +-- OrderSummaryList.vue
|       +-- OrderSuccessView.vue
|       +-- OrderHistoryView.vue
|           +-- OrderCard.vue (per order)
|           +-- StatusBadge.vue
|           +-- PaginationBar.vue
+-- SetupView.vue (unauthenticated, no layout)
```

---

## Page Components (Views)

### SetupView.vue
- **Route**: `/setup`
- **Purpose**: Initial tablet configuration (store ID, table number, password)
- **State**: Local form state (storeId, tableNumber, password)
- **API**: `POST /api/auth/table/login`
- **Behavior**:
  - Form with 3 input fields
  - Submit -> call login API
  - On success: save credentials to localStorage, navigate to /
  - On fail: show error message
  - If already authenticated: redirect to /

### MenuView.vue
- **Route**: `/` (default)
- **Purpose**: Menu browsing with category sidebar
- **State**: Vuex menuStore (categories, menus, activeCategoryId)
- **API**: `GET /api/stores/:storeId/menus`
- **Layout**:
  ```
  +------------------+-----------------------------------+
  | CategorySidebar  |          MenuGrid                 |
  | (fixed left)     |  +--------+ +--------+ +--------+|
  |                  |  |MenuCard| |MenuCard| |MenuCard||
  | [Category 1] *   |  +--------+ +--------+ +--------+|
  | [Category 2]     |  +--------+ +--------+ +--------+|
  | [Category 3]     |  |MenuCard| |MenuCard| |MenuCard||
  |                  |  +--------+ +--------+ +--------+|
  +------------------+-----------------------------------+
  ```
- **Behavior**:
  - On mount: fetch menus, group by category
  - Category click: filter displayed menus
  - MenuCard "Add" button: add to cart, show toast

### OrderConfirmView.vue
- **Route**: `/order/confirm`
- **Purpose**: Final order review before submission
- **State**: Vuex cartStore (items, total)
- **API**: `POST /api/stores/:storeId/tables/:tableId/orders`
- **Behavior**:
  - Display cart items as read-only list
  - Show total amount
  - "Confirm Order" button -> submit to API
  - "Back" button -> navigate to /
  - Empty cart: redirect to /

### OrderSuccessView.vue
- **Route**: `/order/success`
- **Purpose**: Post-order success with countdown
- **State**: Local (orderNumber from route params/state, countdown)
- **Behavior**:
  - Display success icon + order number
  - 5-second countdown timer display
  - Auto-navigate to / when countdown reaches 0
  - No action buttons

### OrderHistoryView.vue
- **Route**: `/orders`
- **Purpose**: Current session order list with real-time status
- **State**: Vuex orderStore (orders, currentPage, totalPages)
- **API**: `GET /api/stores/:storeId/tables/:tableId/orders?sessionId=X&page=N&limit=10`
- **SSE**: `GET /api/stores/:storeId/events` (order:statusChanged)
- **Behavior**:
  - On mount: fetch orders, connect SSE
  - Display paginated order list
  - SSE updates order status in real-time
  - On unmount: disconnect SSE

---

## Shared Components

### AppLayout.vue
- **Purpose**: Authenticated page wrapper
- **Contains**: AppHeader + CartSlidePanel + router-view
- **Slot**: default (page content)

### AppHeader.vue
- **Purpose**: Top header bar
- **Content**:
  - Store/Table info (left)
  - Cart icon with item count badge (right)
  - Order History link (right)
- **Events**: cart icon click -> toggle CartSlidePanel

### CartSlidePanel.vue
- **Purpose**: Right slide-in panel for cart management
- **Props**: `isOpen: boolean`
- **State**: Vuex cartStore
- **Events**: `close`, `goToOrder`
- **Content**:
  - Cart item list (CartItemCard per item)
  - Total amount
  - "Order" button (navigates to /order/confirm)
  - "Clear Cart" button
  - Empty state message when no items
- **Behavior**:
  - Slides in from right
  - Overlay/backdrop behind panel
  - Close on backdrop click or close button

### CartItemCard.vue
- **Purpose**: Single cart item with quantity controls
- **Props**: `item: CartItem`
- **Events**: `updateQuantity(menuId, qty)`, `remove(menuId)`
- **Content**:
  - Menu name, unit price
  - Quantity: [-] count [+] buttons
  - Subtotal (unitPrice x quantity)
  - Remove button

### CategorySidebar.vue
- **Purpose**: Left sidebar for category navigation
- **Props**: `categories: Category[]`, `activeCategoryId: string`
- **Events**: `selectCategory(categoryId)`
- **Content**: Vertical list of category names, active item highlighted

### MenuGrid.vue
- **Purpose**: Grid layout of menu cards
- **Props**: `menus: Menu[]`
- **Content**: Responsive grid of MenuCard components

### MenuCard.vue
- **Purpose**: Single menu item display
- **Props**: `menu: Menu`
- **Events**: `addToCart(menu)`
- **Content**:
  - Menu image (or placeholder)
  - Menu name
  - Price (formatted)
  - "Add" button
- **Size**: Touch-friendly (min 44x44px for button)

### OrderCard.vue
- **Purpose**: Single order display in history
- **Props**: `order: Order`
- **Content**:
  - Order number + time
  - Item list (name x quantity)
  - Total amount
  - StatusBadge

### StatusBadge.vue
- **Purpose**: Order status indicator
- **Props**: `status: OrderStatus`
- **Display**:
  - WAITING: orange badge "Waiting"
  - PREPARING: blue badge "Preparing"
  - COMPLETED: green badge "Completed"

### PaginationBar.vue
- **Purpose**: Page navigation
- **Props**: `currentPage: number`, `totalPages: number`
- **Events**: `pageChange(pageNumber)`
- **Content**: Previous, page numbers, Next buttons

---

## Vuex Store Modules

### auth.js
```
state: { token, storeId, tableId, tableNumber, sessionId }
getters: { isAuthenticated }
mutations: { SET_AUTH, CLEAR_AUTH }
actions: { autoLogin(), login(credentials), logout() }
```

### menu.js
```
state: { categories, menus, activeCategoryId, isLoading, error }
getters: { filteredMenus (by activeCategoryId), sortedCategories }
mutations: { SET_MENUS, SET_CATEGORIES, SET_ACTIVE_CATEGORY, SET_LOADING, SET_ERROR }
actions: { fetchMenus(storeId) }
```

### cart.js
```
state: { items }
getters: { total, itemCount, isEmpty }
mutations: { ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART, LOAD_CART }
actions: { addItem(menu), removeItem(menuId), updateQuantity(menuId, qty), clearCart(), loadFromStorage(), persistToStorage() }
```

### order.js
```
state: { orders, currentPage, totalPages, isLoading, error }
getters: { sortedOrders }
mutations: { SET_ORDERS, SET_PAGINATION, UPDATE_ORDER_STATUS, SET_LOADING, SET_ERROR }
actions: { createOrder(orderData), fetchOrders(page), updateOrderStatus(orderId, status) }
```

### sse.js
```
state: { connected, retryCount }
mutations: { SET_CONNECTED, INCREMENT_RETRY, RESET_RETRY }
actions: { connect(storeId), disconnect(), handleEvent(event) }
```

### ui.js
```
state: { cartPanelOpen, toastMessage, toastType }
mutations: { TOGGLE_CART_PANEL, SET_CART_PANEL, SHOW_TOAST, HIDE_TOAST }
actions: { toggleCartPanel(), showToast(message, type), hideToast() }
```

---

## API Integration Points

| Component | API Endpoint | Method | Trigger |
|---|---|---|---|
| SetupView | /api/auth/table/login | POST | Form submit |
| Auth Store (auto) | /api/auth/table/login | POST | App init, 401 retry |
| MenuView | /api/stores/:storeId/menus | GET | View mount |
| OrderConfirmView | /api/stores/:storeId/tables/:tableId/orders | POST | Confirm button |
| OrderHistoryView | /api/stores/:storeId/tables/:tableId/orders | GET | View mount, page change |
| OrderHistoryView | /api/stores/:storeId/events | SSE | View mount |

---

## User Interaction Flows

### Flow 1: First Time Setup
```
Open app -> SetupView -> Enter credentials -> Login -> MenuView
```

### Flow 2: Returning Visit (Auto Login)
```
Open app -> Auto login (localStorage) -> MenuView
```

### Flow 3: Browse and Order
```
MenuView -> Browse categories -> Add items -> Open cart panel
-> Review cart -> "Order" -> OrderConfirmView -> "Confirm"
-> OrderSuccessView (5s countdown) -> MenuView
```

### Flow 4: Check Order Status
```
MenuView -> Header "Orders" link -> OrderHistoryView
-> View orders with real-time status updates
-> Back to MenuView
```

### Flow 5: Modify Cart
```
Open cart panel -> Adjust quantities (+/-) -> Remove items
-> Close panel (continue browsing) OR "Order" (proceed to confirm)
```
