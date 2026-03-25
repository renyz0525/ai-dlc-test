# Unit Test Execution - Customer Frontend

## Test Stack
- **Runner**: Vitest 2.x
- **Environment**: jsdom
- **Component Testing**: @vue/test-utils
- **Globals**: enabled (describe, it, expect, vi)

## Run Unit Tests

### 1. Execute All Tests
```bash
npx vitest run
```

### 2. Execute Tests in Watch Mode
```bash
npx vitest
```

### 3. Run Specific Test File
```bash
npx vitest run tests/unit/store/cart.test.ts
```

### 4. Run by Pattern
```bash
npx vitest run --reporter=verbose tests/unit/
npx vitest run --reporter=verbose tests/components/
```

## Test Results

### Expected: 61 tests pass, 0 failures

| Test File | Tests | Coverage |
|-----------|-------|----------|
| `tests/unit/api/client.test.ts` | 5 | apiRequest: GET, 401, 4xx/5xx, network error, 204 |
| `tests/unit/store/auth.test.ts` | 7 | login, autoLogin, logout, isAuthenticated, localStorage |
| `tests/unit/store/menu.test.ts` | 5 | fetchMenus, sortedCategories, filteredMenus, setActiveCategory |
| `tests/unit/store/cart.test.ts` | 12 | addItem, removeItem, updateQuantity, clearCart, getters, persistence |
| `tests/unit/store/order.test.ts` | 4 | fetchOrders, createOrder, updateOrderStatus, sortedOrders |
| `tests/unit/utils/format.test.ts` | 5 | formatPrice, formatDate |
| `tests/unit/utils/network.test.ts` | 1 | setToastCallback |
| `tests/components/SetupView.test.ts` | 4 | Form, validation, login, error |
| `tests/components/MenuView.test.ts` | 3 | Render, loading, error |
| `tests/components/CartSlidePanel.test.ts` | 4 | Items, empty, total, navigation |
| `tests/components/OrderConfirmView.test.ts` | 5 | Render, empty redirect, submit, error |
| `tests/components/OrderHistoryView.test.ts` | 6 | Orders, SSE, loading, empty, error, pagination |

## Fix Failing Tests

If tests fail:
1. Review test output for error messages
2. Check if source code changes broke existing contracts
3. Update mock data if API contracts changed
4. Run `npx vitest run --reporter=verbose` for detailed output
