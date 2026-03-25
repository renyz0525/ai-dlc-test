# Customer Frontend - Business Logic Model

## 1. Auth (Auto Login) Business Logic

### 1.1 Initial Setup Flow
```
User opens app
  -> Check localStorage for saved credentials
  -> IF credentials exist:
       -> Call POST /api/auth/table/login with saved credentials
       -> IF login success:
            -> Store token in memory (Vuex)
            -> Store sessionId, tableId, storeId in Vuex
            -> Navigate to Menu View (/)
       -> IF login fail (invalid credentials):
            -> Clear saved credentials from localStorage
            -> Navigate to Setup View (/setup)
  -> IF no credentials:
       -> Navigate to Setup View (/setup)
```

### 1.2 Setup Flow
```
Admin enters Setup View (/setup)
  -> Input: storeId, tableNumber, password
  -> Call POST /api/auth/table/login
  -> IF success:
       -> Save credentials to localStorage (storeId, tableNumber, password)
       -> Store token, sessionId, tableId in Vuex
       -> Navigate to Menu View (/)
  -> IF fail:
       -> Display error message
       -> Stay on Setup View
```

### 1.3 Session Maintenance
```
On each API request:
  -> Attach token from Vuex to Authorization header
  -> IF 401 response:
       -> Attempt auto re-login with saved credentials
       -> IF re-login success:
            -> Retry original request with new token
       -> IF re-login fail:
            -> Clear credentials
            -> Navigate to Setup View
```

### 1.4 Token Storage
- **Token**: Vuex state only (not persisted to localStorage for security)
- **Credentials**: localStorage (storeId, tableNumber, password) for auto re-login
- **Session Info**: Vuex state (sessionId, tableId, storeId)

---

## 2. Menu View Business Logic

### 2.1 Menu Loading
```
On Menu View mount:
  -> Fetch menus: GET /api/stores/:storeId/menus
  -> Group menus by categoryId
  -> Sort categories by sortOrder
  -> Sort menus within each category by sortOrder
  -> Display first category as default selected
```

### 2.2 Category Navigation (Left Sidebar)
```
Categories displayed in left sidebar (fixed position)
  -> On category click:
       -> Set active category
       -> Filter menu grid to show only selected category's menus
       -> Highlight active category in sidebar
```

### 2.3 Menu Card Display
```
Each menu card shows:
  - Menu image (or placeholder if no image)
  - Menu name
  - Price (formatted with comma separator, won symbol)
  - "Add" button (adds 1 item to cart)
```

### 2.4 Add to Cart from Menu
```
On "Add" button click:
  -> Add 1 quantity of this menu to cart
  -> Show brief toast/feedback "Added to cart"
  -> Update cart badge count (if visible)
```

---

## 3. Cart Business Logic

### 3.1 Cart Data Structure
```
CartItem {
  menuId: string
  menuName: string
  unitPrice: number
  quantity: number
  imageUrl: string | null
}

Cart {
  items: CartItem[]
  total: computed -> sum of (unitPrice * quantity) for all items
  itemCount: computed -> sum of quantity for all items
}
```

### 3.2 Cart Operations
```
addItem(menu):
  -> IF menu already in cart:
       -> Increment quantity by 1
  -> ELSE:
       -> Add new CartItem with quantity 1
  -> Persist to localStorage
  -> Recalculate total

removeItem(menuId):
  -> Remove item from cart
  -> Persist to localStorage
  -> Recalculate total

updateQuantity(menuId, newQuantity):
  -> IF newQuantity <= 0:
       -> Remove item from cart
  -> ELSE:
       -> Set item quantity to newQuantity
  -> Persist to localStorage
  -> Recalculate total

clearCart():
  -> Remove all items
  -> Clear localStorage cart data
  -> Reset total to 0
```

### 3.3 Cart Slide Panel (Right)
```
On cart icon/button click:
  -> Slide panel opens from right
  -> Display: cart items list, quantity controls (+/-), item subtotals, total
  -> "Order" button at bottom (navigates to Order Confirm)
  -> "Close" button to dismiss panel
  -> IF cart empty:
       -> Show empty state message
       -> Disable "Order" button
```

### 3.4 Cart Persistence
```
On any cart change:
  -> Serialize cart items to JSON
  -> Save to localStorage key: 'table-order-cart'

On app init:
  -> Load cart from localStorage key: 'table-order-cart'
  -> IF data exists and valid JSON:
       -> Restore cart items to Vuex store
  -> ELSE:
       -> Initialize empty cart
```

---

## 4. Order Creation Business Logic

### 4.1 Order Confirm View
```
On Order Confirm View mount:
  -> Read cart items from Vuex
  -> IF cart is empty:
       -> Navigate back to Menu View
  -> Display order summary:
       -> List of items (name, quantity, unit price, subtotal)
       -> Total amount
  -> "Confirm Order" button
  -> "Back" button (return to Menu View)
```

### 4.2 Order Submission
```
On "Confirm Order" click:
  -> Disable button (prevent double submit)
  -> Build OrderCreateDto:
       {
         items: [{ menuId, menuName, quantity, unitPrice }],
         totalAmount: cart.total
       }
  -> Call POST /api/stores/:storeId/tables/:tableId/orders
  -> IF success:
       -> Display order number
       -> Clear cart (Vuex + localStorage)
       -> Start 5-second countdown
       -> After countdown -> Navigate to Menu View (/)
  -> IF fail:
       -> Show error message (Toast)
       -> Re-enable "Confirm Order" button
       -> Cart remains intact
```

### 4.3 Order Success Screen
```
Display:
  - Success icon/message
  - Order number (from API response)
  - 5-second countdown timer
  - Auto-redirect to Menu View when countdown reaches 0
  - No user action buttons (auto-redirect only)
```

---

## 5. Order History Business Logic

### 5.1 Order History View
```
On Order History View mount:
  -> Fetch orders: GET /api/stores/:storeId/tables/:tableId/orders?sessionId=currentSessionId
  -> Connect SSE: GET /api/stores/:storeId/events (for real-time status updates)
  -> Display orders sorted by creation time (newest first)
  -> Paginate with page-based pagination
```

### 5.2 Pagination
```
- Page size: 10 orders per page
- Display page navigation buttons (prev, page numbers, next)
- Fetch specific page from API: ?page=N&limit=10
- Show current page / total pages
```

### 5.3 Order Display
```
Each order shows:
  - Order number
  - Order time (formatted: YYYY-MM-DD HH:mm)
  - Order items (menu name x quantity)
  - Total amount
  - Status badge:
      - "Waiting" (orange) - default
      - "Preparing" (blue) - kitchen preparing
      - "Completed" (green) - ready/done
```

### 5.4 Real-time Status Update (SSE)
```
On SSE event 'order:statusChanged':
  -> IF event.orderId matches any displayed order:
       -> Update that order's status in Vuex
       -> UI reactively updates status badge

On component unmount:
  -> Disconnect SSE connection
```

---

## 6. SSE Connection Management

### 6.1 SSE for Order History
```
connectSSE(storeId):
  -> Create EventSource for GET /api/stores/:storeId/events
  -> Listen for 'order:statusChanged' events
  -> On event: update matching order status in Vuex store

disconnectSSE():
  -> Close EventSource connection
  -> Clean up event listeners

reconnectSSE():
  -> On connection error/close:
       -> Wait 3 seconds
       -> Attempt reconnection
       -> Max 5 retry attempts
       -> After max retries: show "connection lost" message
```

---

## 7. Navigation Structure

```
Routes:
  /setup          -> SetupView (initial tablet configuration)
  /               -> MenuView (default/home, menu browsing)
  /order/confirm  -> OrderConfirmView (order confirmation before submit)
  /order/success  -> OrderSuccessView (post-order success with countdown)
  /orders         -> OrderHistoryView (current session order list)

Navigation Guard:
  -> Before each route (except /setup):
       -> Check if authenticated (token in Vuex)
       -> IF not authenticated:
            -> Attempt auto-login from localStorage
            -> IF fail: redirect to /setup
  -> /setup route:
       -> IF already authenticated: redirect to /
```
