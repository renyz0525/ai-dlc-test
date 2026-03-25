# Integration Test Instructions - Customer Frontend

## Purpose
Test interactions between Customer Frontend and Backend API to ensure end-to-end functionality.

## Prerequisites
- Backend API service running (Unit 1 - Backend must be deployed or running locally)
- `.env` configured with `VITE_USE_MOCK=false` and correct `VITE_API_BASE_URL`

## Test Scenarios

### Scenario 1: Authentication Flow
- **Description**: Login with table credentials via Backend API
- **Setup**: Backend running with test store/table data
- **Test Steps**:
  1. Open `/setup` page
  2. Enter valid storeId, tableNumber, password
  3. Submit form
  4. Verify redirect to menu page `/`
  5. Verify JWT token stored in localStorage
- **Expected Results**: Successful login, token received, auto-redirect

### Scenario 2: Menu Loading
- **Description**: Fetch menu data from Backend API
- **Setup**: Backend running with menu data for test store
- **Test Steps**:
  1. Login via setup page
  2. Verify categories loaded in sidebar
  3. Click different categories
  4. Verify menu items filtered correctly
- **Expected Results**: Categories and menus displayed correctly

### Scenario 3: Order Creation Flow
- **Description**: Complete order from cart to success
- **Setup**: Backend running with menu and order service
- **Test Steps**:
  1. Add items to cart from menu
  2. Open cart panel, click "주문하기"
  3. Confirm order on `/order/confirm`
  4. Verify redirect to `/order/success` with order number
  5. Verify order appears in `/orders` history
- **Expected Results**: Order created, success page shown, order in history

### Scenario 4: SSE Real-time Updates
- **Description**: Receive order status updates via SSE
- **Setup**: Backend running with SSE endpoint
- **Test Steps**:
  1. Create an order
  2. Navigate to `/orders`
  3. Change order status via Admin or Backend directly
  4. Verify status badge updates in real-time (without refresh)
- **Expected Results**: Status badge changes from WAITING to PREPARING to COMPLETED

## Setup Integration Test Environment

### 1. Start Backend Service
```bash
# In backend project directory (Unit 1)
# Follow backend's build-and-test instructions to start the service
```

### 2. Configure Frontend
```bash
# In customer-frontend project root
echo "VITE_USE_MOCK=false" > .env.local
echo "VITE_API_BASE_URL=http://localhost:8080/api" >> .env.local
npm run dev
```

### 3. Manual Integration Testing
Open browser at `http://localhost:5173` and execute test scenarios above.

## Note
Automated integration tests (e.g., Cypress, Playwright) are not in scope for this phase. Integration testing is manual until Backend API is available.
