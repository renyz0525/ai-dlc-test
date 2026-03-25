# Customer Frontend - Tech Stack Decisions

## Core Framework & Build

| Technology | Version | Purpose | Rationale |
|---|---|---|---|
| Vue.js | 3.x (latest) | UI Framework | Composition API, reactive system, team decision |
| Vite | 5.x (latest) | Build Tool | Fast HMR, native ESM, Vue 3 optimized |
| TypeScript | 5.x | Type Safety | Compile-time error detection, better IDE support |

## UI & Styling

| Technology | Version | Purpose | Rationale |
|---|---|---|---|
| TailwindCSS | 3.x | Utility-first CSS | Rapid responsive development, no CSS file management |
| PrimeVue | 4.x (latest) | UI Component Library | Rich Vue 3 components (Button, Dialog, Toast, DataTable, Paginator) |
| PrimeIcons | latest | Icon Library | PrimeVue integrated icons |

## State Management

| Technology | Version | Purpose | Rationale |
|---|---|---|---|
| Vuex | 4.x | Global State | Team decision, centralized store for auth/menu/cart/order/sse/ui |

## Routing

| Technology | Version | Purpose | Rationale |
|---|---|---|---|
| Vue Router | 4.x | Client Routing | Vue 3 standard router, navigation guards for auth |

## Testing

| Technology | Version | Purpose | Rationale |
|---|---|---|---|
| Vitest | latest | Unit Test Runner | Vite-native, fast execution, Vue ecosystem standard |
| @vue/test-utils | latest | Component Testing | Official Vue 3 component test utility |
| @testing-library/vue | latest | Component Testing | User-centric testing approach |

## API Communication

| Technology | Purpose | Rationale |
|---|---|---|
| Fetch API (native) | REST API calls | No additional HTTP library needed for simple REST calls |
| EventSource (native) | SSE connection | Browser-native SSE support, no library needed |

## Development Dependencies

| Technology | Purpose | Rationale |
|---|---|---|
| @vitejs/plugin-vue | Vite Vue plugin | Vue SFC compilation |
| autoprefixer | CSS vendor prefixes | Browser compatibility |
| postcss | CSS processing | TailwindCSS requirement |

## Explicitly NOT Included

| Technology | Reason |
|---|---|
| Axios | Fetch API sufficient for simple REST calls |
| ESLint / Prettier | User decision: not applied |
| i18n (vue-i18n) | Korean only, no multi-language needed |
| PWA / Service Worker | Basic network detection only, no offline caching |
| Image optimization library | Basic img tags, no lazy loading |
| Storybook | Not required for this project scope |
| E2E testing (Cypress/Playwright) | Component + unit testing sufficient for MVP |

## Package.json Dependencies (Planned)

### dependencies
```json
{
  "vue": "^3.x",
  "vue-router": "^4.x",
  "vuex": "^4.x",
  "primevue": "^4.x",
  "primeicons": "^7.x"
}
```

### devDependencies
```json
{
  "@vitejs/plugin-vue": "^5.x",
  "vite": "^5.x",
  "typescript": "^5.x",
  "vue-tsc": "^2.x",
  "tailwindcss": "^3.x",
  "autoprefixer": "^10.x",
  "postcss": "^8.x",
  "vitest": "^2.x",
  "@vue/test-utils": "^2.x",
  "@testing-library/vue": "^8.x"
}
```

## Build Configuration

### Vite Config
- Target: `['es2020', 'chrome80', 'safari14', 'firefox78', 'edge88']`
- Source maps: development only
- Chunk splitting: vendor chunk for Vue/PrimeVue, app chunk for application code

### TailwindCSS Config
- Content paths: `./src/**/*.{vue,js,ts,jsx,tsx}`
- Responsive breakpoints: default TailwindCSS (sm, md, lg, xl, 2xl)
- PrimeVue preset integration (if using unstyled mode with Tailwind)

## Mock Strategy (Pre-API Integration)

| Approach | Implementation |
|---|---|
| **Vuex Mock Data** | Hardcoded data in Vuex store actions |
| **Toggle Mechanism** | Environment variable `VITE_USE_MOCK=true` |
| **API Layer** | `src/api/` module with mock/real implementations |
| **Swap Strategy** | Replace mock implementations with real API calls when backend is ready |
