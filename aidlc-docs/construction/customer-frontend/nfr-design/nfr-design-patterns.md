# Customer Frontend - NFR Design Patterns

## 1. API Layer Pattern (Mock/Real Toggle)

### Pattern: Environment Variable Branch

API 모듈 내에서 `VITE_USE_MOCK` 환경변수로 Mock/Real 분기 처리.

```
src/api/
+-- index.ts          # API 모듈 export (공통 진입점)
+-- client.ts         # HTTP client (fetch wrapper with auth interceptor)
+-- auth.ts           # Auth API functions
+-- menu.ts           # Menu API functions
+-- order.ts          # Order API functions
+-- sse.ts            # SSE connection manager
+-- mock/
|   +-- data.ts       # Mock data definitions
|   +-- auth.ts       # Mock auth responses
|   +-- menu.ts       # Mock menu responses
|   +-- order.ts      # Mock order responses
```

### API Function Pattern
```typescript
// src/api/menu.ts
import { mockMenus } from './mock/menu'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export async function fetchMenus(storeId: string): Promise<Menu[]> {
  if (USE_MOCK) {
    return Promise.resolve(mockMenus)
  }
  return apiClient.get(`/api/stores/${storeId}/menus`)
}
```

### API Client (fetch wrapper)
```typescript
// src/api/client.ts
class ApiClient {
  private baseUrl: string
  private getToken: () => string | null

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method, headers, body: body ? JSON.stringify(body) : undefined
    })

    if (response.status === 401) {
      // Trigger auto re-login via store
      throw new UnauthorizedError()
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ApiError(response.status, error.message || 'Server error')
    }
    return response.json()
  }

  get<T>(path: string): Promise<T> { return this.request('GET', path) }
  post<T>(path: string, body: unknown): Promise<T> { return this.request('POST', path, body) }
  patch<T>(path: string, body: unknown): Promise<T> { return this.request('PATCH', path, body) }
  delete<T>(path: string): Promise<T> { return this.request('DELETE', path) }
}
```

### Auth Interceptor Flow
```
API Request
  -> Attach Bearer token from Vuex auth store
  -> Send request
  -> IF 401:
       -> Dispatch auth/autoLogin action
       -> IF re-login success: retry original request (1 time only)
       -> IF re-login fail: redirect to /setup
  -> IF network error:
       -> Show network error toast
       -> Reject promise
  -> IF 4xx/5xx:
       -> Throw ApiError with server message
```

---

## 2. Network Resilience Pattern

### Pattern: Online/Offline Detection + Toast Notification

```typescript
// src/utils/network.ts
export function setupNetworkDetection(store: Store) {
  window.addEventListener('offline', () => {
    store.dispatch('ui/showToast', {
      message: 'Network disconnected',
      type: 'error',
      persistent: true  // stays until online
    })
  })

  window.addEventListener('online', () => {
    store.dispatch('ui/showToast', {
      message: 'Network reconnected',
      type: 'success',
      persistent: false  // auto-dismiss after 3s
    })
    // Retry last failed request if any
    store.dispatch('network/retryPending')
  })
}
```

### Toast Notification
- PrimeVue Toast component 사용
- Network disconnect: persistent error toast (수동 닫기 전까지 표시)
- Network reconnect: success toast (3초 후 자동 닫기)
- API errors: error toast (5초 후 자동 닫기)
- Cart add: info toast (2초 후 자동 닫기)

---

## 3. SSE Resilience Pattern

### Pattern: Auto-Reconnect with Retry Limit

```
SSE Connection
  -> Create EventSource
  -> On open: set connected = true, reset retryCount
  -> On message: dispatch event to Vuex store
  -> On error:
       -> Close current connection
       -> IF retryCount < 5:
            -> Wait 3 seconds
            -> Increment retryCount
            -> Reconnect
       -> IF retryCount >= 5:
            -> Show "Real-time connection lost" toast
            -> Stop reconnection attempts
            -> User can manually refresh page to retry
```

### SSE Manager
```typescript
// src/api/sse.ts
class SSEManager {
  private eventSource: EventSource | null = null
  private retryCount = 0
  private maxRetries = 5
  private retryDelay = 3000

  connect(storeId: string, onEvent: (event: SSEEvent) => void) {
    const url = `${baseUrl}/api/stores/${storeId}/events`
    this.eventSource = new EventSource(url)

    this.eventSource.onopen = () => {
      this.retryCount = 0
    }

    this.eventSource.addEventListener('order:statusChanged', (e) => {
      onEvent(JSON.parse(e.data))
    })

    this.eventSource.onerror = () => {
      this.disconnect()
      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        setTimeout(() => this.connect(storeId, onEvent), this.retryDelay)
      }
    }
  }

  disconnect() {
    this.eventSource?.close()
    this.eventSource = null
  }
}
```

---

## 4. Responsive Layout Pattern

### Pattern: Breakpoint-Adaptive Layout

```
Desktop/Tablet (>= 768px):
+------------------+-----------------------------------+
| Category         |          Menu Grid                |
| Sidebar          |  (2-4 columns based on width)     |
| (fixed left)     |                                   |
+------------------+-----------------------------------+

Mobile (< 768px):
+-----------------------------------------------+
| [Category Dropdown v]                         |
+-----------------------------------------------+
| Menu Grid (1 column)                          |
|                                               |
+-----------------------------------------------+
```

### Implementation
```vue
<!-- MenuView.vue -->
<template>
  <div class="flex">
    <!-- Desktop/Tablet: Sidebar -->
    <CategorySidebar
      v-if="!isMobile"
      :categories="categories"
      :activeCategoryId="activeCategoryId"
      @selectCategory="setCategory"
    />

    <div class="flex-1">
      <!-- Mobile: Dropdown -->
      <CategoryDropdown
        v-if="isMobile"
        :categories="categories"
        :activeCategoryId="activeCategoryId"
        @selectCategory="setCategory"
      />

      <MenuGrid :menus="filteredMenus" />
    </div>
  </div>
</template>
```

### Breakpoint Detection
```typescript
// src/composables/useBreakpoint.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoint() {
  const isMobile = ref(window.innerWidth < 768)

  function onResize() {
    isMobile.value = window.innerWidth < 768
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { isMobile }
}
```

### Menu Grid Responsive Columns
- Mobile (< 768px): 1 column
- Tablet (768px - 1024px): 2 columns
- Desktop (> 1024px): 3-4 columns
- TailwindCSS: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

### Cart Slide Panel Responsive
- Desktop/Tablet: Right slide panel (width: 400px)
- Mobile: Full-width bottom sheet or full-screen overlay

---

## 5. State Persistence Pattern

### Pattern: Vuex Plugin for localStorage Sync

```typescript
// src/store/plugins/persistence.ts
export function createPersistencePlugin() {
  return (store: Store) => {
    // Load on init
    store.dispatch('cart/loadFromStorage')
    store.dispatch('auth/loadCredentials')

    // Subscribe to mutations
    store.subscribe((mutation) => {
      if (mutation.type.startsWith('cart/')) {
        store.dispatch('cart/persistToStorage')
      }
    })
  }
}
```

### localStorage Keys
| Key | Vuex Module | Sync Direction |
|---|---|---|
| `table-order-credentials` | auth | bidirectional (load on init, save on login) |
| `table-order-cart` | cart | bidirectional (load on init, save on every change) |

### Error Handling
- localStorage unavailable: graceful degradation, cart not persisted
- Corrupt data: catch JSON.parse errors, reset to default state

---

## 6. PrimeVue Integration Pattern

### Pattern: Styled Mode + TailwindCSS Supplemental

- PrimeVue components use built-in Aura/Lara theme
- TailwindCSS for layout, spacing, custom styling
- PrimeVue components used:
  - **Button** - All action buttons
  - **Toast** - Notifications (network, cart, errors)
  - **Dialog** - Confirmation dialogs
  - **Dropdown** - Mobile category selector
  - **Paginator** - Order history pagination
  - **Sidebar** - Cart slide panel
  - **Badge** - Cart item count, order status
  - **Skeleton** - Loading states
  - **InputText / Password** - Setup form inputs

### Theme Configuration
```typescript
// main.ts
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})
```

---

## 7. Router Guard Pattern

### Pattern: Navigation Guard with Auto-Login

```typescript
// src/router/index.ts
router.beforeEach(async (to, from, next) => {
  const authStore = store.state.auth

  if (to.path === '/setup') {
    if (authStore.isAuthenticated) {
      return next('/')
    }
    return next()
  }

  if (!authStore.isAuthenticated) {
    const success = await store.dispatch('auth/autoLogin')
    if (!success) {
      return next('/setup')
    }
  }

  next()
})
```

---

## Design Patterns Summary

| Pattern | NFR Addressed | Implementation |
|---|---|---|
| Env Variable Branch | Maintainability (Mock/Real) | `VITE_USE_MOCK` in API layer |
| Auth Interceptor | Security, Reliability | ApiClient with 401 auto re-login |
| Network Detection | Reliability | `online`/`offline` events + Toast |
| SSE Auto-Reconnect | Reliability, Performance | Retry 5x with 3s intervals |
| Breakpoint-Adaptive | Usability (Responsive) | Sidebar/Dropdown swap at 768px |
| State Persistence Plugin | Reliability | Vuex plugin for localStorage sync |
| Styled PrimeVue + Tailwind | Usability, Performance | PrimeVue Aura theme + TailwindCSS layout |
| Navigation Guard | Security | beforeEach with auto-login |
