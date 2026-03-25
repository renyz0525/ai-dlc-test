# Build Instructions - Customer Frontend

## Prerequisites
- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **Build Tool**: Vite 6.x
- **OS**: macOS, Linux, Windows

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment

**Development (Mock API)**:
```bash
# .env.development is used automatically with `npm run dev`
# VITE_USE_MOCK=true (uses internal mock data)
# VITE_API_BASE_URL=http://localhost:8080/api
```

**Production (Real API)**:
```bash
# .env.production is used automatically with `npm run build`
# VITE_USE_MOCK=false (connects to real backend)
# VITE_API_BASE_URL=<backend-api-url>
```

### 3. Development Server
```bash
npm run dev
# Starts on http://localhost:5173
```

### 4. Production Build
```bash
npm run build
```

### 5. Verify Build Success
- **Expected Output**: `dist/` directory with index.html + assets
- **Build Artifacts**:
  - `dist/index.html` - Entry point
  - `dist/assets/*.js` - JS chunks (code-split per route)
  - `dist/assets/*.css` - Compiled CSS (TailwindCSS + PrimeVue)
  - `dist/assets/primeicons-*` - PrimeVue icon fonts
- **Total Size**: ~350KB gzipped (main bundle)

### 6. Preview Production Build
```bash
npm run preview
# Serves production build on http://localhost:4173
```

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: Missing or incompatible node_modules
- **Solution**: `rm -rf node_modules package-lock.json && npm install`

### TypeScript Errors in vue-tsc
- **Known Issue**: Vuex 4 types with `moduleResolution: "bundler"` produce warnings
- **Solution**: `vuex` module declaration is provided in `src/env.d.ts`. These don't affect Vite build.
