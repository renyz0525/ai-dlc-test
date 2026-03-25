# Customer Frontend - Business Rules

## BR-01: Authentication Rules

### BR-01-01: Credential Storage
- Credentials (storeId, tableNumber, password) are stored in localStorage
- Token is stored in Vuex state only (not persisted)
- On app reload, auto-login is attempted using stored credentials

### BR-01-02: Session Expiration
- Token has 16-hour expiry (controlled by backend)
- On 401 response, attempt auto re-login with saved credentials
- If re-login fails, clear all credentials and redirect to /setup

### BR-01-03: Setup Access
- Setup view is shown ONLY when no saved credentials exist
- After successful setup, user is redirected to menu view
- If authenticated user navigates to /setup, redirect to /

---

## BR-02: Menu Display Rules

### BR-02-01: Category Display
- Categories are displayed in left sidebar, sorted by sortOrder
- First category is selected by default on page load
- Only menus belonging to the selected category are displayed
- Category with zero menus is still displayed (shows empty state)

### BR-02-02: Menu Card Display
- Menu cards show: image, name, price, "Add" button
- Price format: comma-separated with won symbol (e.g., 12,000)
- If menu has no image, display placeholder image
- Menus sorted by sortOrder within each category

### BR-02-03: Touch Friendliness
- Minimum touch target size: 44x44px for all interactive elements
- "Add" button must be large enough for easy touch interaction
- Category sidebar items must have adequate spacing for touch

---

## BR-03: Cart Rules

### BR-03-01: Cart Item Management
- Same menu added multiple times increments quantity (not duplicate entries)
- Minimum quantity per item: 1
- When quantity reaches 0, item is removed from cart
- No maximum quantity limit enforced on client (backend may enforce)

### BR-03-02: Cart Persistence
- Cart is persisted to localStorage on every change
- Cart survives page refresh
- Cart is cleared ONLY on: successful order submission, manual clear action
- localStorage key: 'table-order-cart'

### BR-03-03: Cart Total Calculation
- Total = SUM(unitPrice * quantity) for all cart items
- Total is recalculated on every cart change
- Prices are integer values (won, no decimals)

### BR-03-04: Cart Slide Panel
- Opens from right side on cart button click
- Shows item list with quantity controls (+/-)
- Shows total amount
- "Order" button disabled when cart is empty
- Panel can be closed by clicking outside or close button

---

## BR-04: Order Rules

### BR-04-01: Order Submission
- Order can only be submitted when cart has at least 1 item
- "Confirm Order" button is disabled during API call (prevent double submit)
- Order includes: items (menuId, menuName, quantity, unitPrice), totalAmount

### BR-04-02: Order Success
- On success: display order number, clear cart, start 5-second countdown
- Countdown is visual only (no user action buttons)
- After 5 seconds, auto-redirect to Menu View (/)
- Cart is cleared from both Vuex and localStorage

### BR-04-03: Order Failure
- On failure: display error toast message
- Cart remains intact (no data loss)
- "Confirm Order" button is re-enabled
- User can retry or go back to modify cart

---

## BR-05: Order History Rules

### BR-05-01: Data Scope
- Only current session's orders are displayed
- Orders from previous sessions (completed via admin "Table Complete") are excluded
- Session is identified by sessionId from auth response

### BR-05-02: Order Sorting
- Orders sorted by creation time, newest first

### BR-05-03: Pagination
- Page size: 10 orders per page
- Standard page-based pagination with page number buttons
- Show current page and total pages

### BR-05-04: Status Display
- Status values: "Waiting" / "Preparing" / "Completed"
- Each status has distinct color: orange / blue / green
- Status updates in real-time via SSE

### BR-05-05: Real-time Updates
- SSE connection established on Order History view mount
- Listen for 'order:statusChanged' events
- Update matching order's status reactively
- SSE disconnected on view unmount
- On SSE connection failure: retry up to 5 times with 3-second intervals

---

## BR-06: Navigation Rules

### BR-06-01: Route Guard
- All routes except /setup require authentication
- Unauthenticated access triggers auto-login attempt
- Failed auto-login redirects to /setup

### BR-06-02: Default Route
- "/" (Menu View) is the default/home page
- Authenticated users always land on Menu View

### BR-06-03: Order Flow Navigation
- Menu View -> Cart Panel -> Order Confirm -> Order Success -> Menu View (auto)
- Order Confirm with empty cart redirects to Menu View
- Back button on Order Confirm returns to Menu View

---

## BR-07: API Error Handling Rules

### BR-07-01: Network Errors
- Display "Network connection error" toast message
- Do not clear user data or cart on network errors
- Allow user to retry the action

### BR-07-02: 401 Unauthorized
- Attempt auto re-login with saved credentials
- If re-login succeeds, retry the original request
- If re-login fails, redirect to /setup

### BR-07-03: 4xx Client Errors
- Display error message from server response
- Do not retry automatically

### BR-07-04: 5xx Server Errors
- Display "Server error, please try again" toast message
- Allow user to retry
