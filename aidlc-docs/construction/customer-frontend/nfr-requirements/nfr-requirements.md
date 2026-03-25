# Customer Frontend - NFR Requirements

## NFR-CF01: Performance

### NFR-CF01-01: Initial Load
- First Contentful Paint (FCP): < 2 seconds on 4G network
- Time to Interactive (TTI): < 3 seconds on 4G network
- Bundle size target: < 500KB gzipped (initial chunk)

### NFR-CF01-02: Navigation & Interaction
- Route transition: < 300ms
- Cart operations (add/remove/update): < 100ms (local, no API call)
- Category sidebar click -> menu grid filter: < 100ms
- Cart slide panel open/close animation: < 300ms

### NFR-CF01-03: API Response Handling
- Menu list fetch: render within 1 second of API response
- Order submission: disable button immediately, show result within API response time + 100ms
- Order history fetch: render within 1 second of API response

### NFR-CF01-04: SSE Performance
- SSE event processing (order status change): UI update within 500ms of event receipt
- SSE reconnection attempt: within 3 seconds of disconnect

---

## NFR-CF02: Usability

### NFR-CF02-01: Responsive Design
- **Full responsive**: Mobile (< 768px), Tablet (768px - 1024px), Desktop (> 1024px)
- Breakpoints follow TailwindCSS defaults: sm(640px), md(768px), lg(1024px), xl(1280px)
- Layout adjustments:
  - Mobile: Category sidebar collapses to top horizontal scroll, single column menu grid
  - Tablet: Left sidebar + 2-3 column menu grid
  - Desktop: Left sidebar + 3-4 column menu grid

### NFR-CF02-02: Touch & Interaction
- Minimum touch target size: 44x44px (WCAG 2.5.5)
- Touch-friendly spacing between interactive elements
- No hover-dependent interactions (must work on touch devices)
- Smooth scroll behavior for category navigation

### NFR-CF02-03: Visual Feedback
- Button press: visual feedback within 100ms
- Cart add: toast notification for confirmation
- Loading states: skeleton or spinner for API calls
- Error states: clear error messages in Korean

### NFR-CF02-04: Language
- All UI text in Korean (hard-coded)
- No i18n framework
- Currency format: Korean Won with comma separator (e.g., 12,000)

---

## NFR-CF03: Reliability

### NFR-CF03-01: Network Resilience
- Network status detection using `navigator.onLine` + `online`/`offline` events
- On disconnect: show non-blocking banner "Network disconnected"
- On reconnect: auto-retry last failed request, hide banner
- SSE auto-reconnect: up to 5 retries with 3-second intervals

### NFR-CF03-02: Data Persistence
- Cart data: localStorage persistence, survives page refresh/close
- Auth credentials: localStorage persistence for auto-login
- Token: Vuex only (not persisted for security)
- Graceful degradation if localStorage unavailable

### NFR-CF03-03: Error Recovery
- API 401: auto re-login with saved credentials, retry original request
- API 4xx: display server error message, no retry
- API 5xx: display generic error, allow manual retry
- Network error: display connection error, auto-retry on reconnect
- SSE disconnect: auto-reconnect with exponential backoff (max 5 retries)

### NFR-CF03-04: State Consistency
- Cart state always synchronized between Vuex and localStorage
- Order history reflects latest SSE updates
- Auth state validated on each route navigation

---

## NFR-CF04: Security

### NFR-CF04-01: Token Management
- JWT token stored in Vuex state only (memory, not localStorage)
- Token attached via Authorization header (Bearer token)
- No token in URL query parameters
- Token cleared on logout/session expiry

### NFR-CF04-02: Credential Storage
- Login credentials (storeId, tableNumber, password) stored in localStorage
- Password stored as-is for auto-login (transmitted over HTTPS to backend for verification)
- No sensitive business data in localStorage beyond credentials and cart

### NFR-CF04-03: XSS Prevention
- Vue.js default template escaping (v-html avoided)
- No dynamic script injection
- Content Security Policy headers (delegated to backend/server config)

### NFR-CF04-04: API Security
- All API calls include Authorization header
- CORS handled by backend
- No direct database access from frontend

---

## NFR-CF05: Maintainability

### NFR-CF05-01: Code Structure
- Vue Single File Components (.vue)
- TypeScript for type safety
- Vuex modules per domain (auth, menu, cart, order, sse, ui)
- API layer separated from store logic
- Consistent file naming: PascalCase for components, camelCase for utilities

### NFR-CF05-02: Testing
- Unit test framework: Vitest
- Component test: Vue Test Utils + @testing-library/vue
- Test coverage target: Store modules (mutations, actions, getters) and utility functions
- Component tests for key user interactions

### NFR-CF05-03: Build & Development
- Build tool: Vite (fast HMR, optimized production builds)
- No linter/formatter configured (per user decision)
- Source maps in development, disabled in production

---

## NFR-CF06: Browser Compatibility

### NFR-CF06-01: Supported Browsers
- Chrome (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)

### NFR-CF06-02: Required Browser Features
- ES2020+ (async/await, optional chaining)
- EventSource API (SSE)
- localStorage API
- Intersection Observer API (future use)
- CSS Grid & Flexbox

### NFR-CF06-03: Vite Build Target
- Vite build target: `['es2020', 'chrome80', 'safari14', 'firefox78', 'edge88']`

---

## NFR Summary Matrix

| Category | Priority | Key Metric |
|---|---|---|
| Performance | High | FCP < 2s, TTI < 3s, interactions < 100ms |
| Usability | High | Full responsive, 44px touch targets, Korean only |
| Reliability | High | Network detection, SSE reconnect, localStorage persistence |
| Security | Medium | JWT in memory, XSS prevention, HTTPS |
| Maintainability | Medium | Vitest + Vue Test Utils, TypeScript, Vuex modules |
| Browser Compatibility | Medium | Chrome/Safari/Firefox/Edge latest 2 versions |
