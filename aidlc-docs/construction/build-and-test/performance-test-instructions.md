# Performance Test Instructions

## Purpose
Admin Frontend의 성능 요구사항 충족 여부를 검증합니다.

## Performance Requirements (NFR)
- **Initial Load**: < 3초 (LTE 네트워크)
- **Page Navigation**: < 500ms
- **SSE Event Processing**: < 100ms (수신 -> UI 반영)
- **Bundle Size**: < 500KB (gzipped)
- **Concurrent Tables**: 30개 테이블 동시 모니터링

## Build Performance Analysis

### 1. Bundle Size Analysis
```bash
npm run build
npx vite-bundle-visualizer
```

**Check Points**:
- Total bundle size (gzipped) < 500KB
- 각 route chunk가 적절히 분리되어 있는지 확인
- 큰 의존성이 tree-shaking 되고 있는지 확인

### 2. Lighthouse Audit
```bash
# Production build 후
npm run preview
# 브라우저에서 http://localhost:4173 접속
# Chrome DevTools > Lighthouse 탭 > Performance audit 실행
```

**Target Scores**:
- Performance: > 90
- Best Practices: > 90
- Accessibility: > 80

### 3. Route-based Code Splitting Verification
```bash
npm run build
```

빌드 출력에서 chunk 분리 확인:
- `LoginView` chunk
- `DashboardView` chunk
- `TableManagementView` + `TableSetupView` chunk
- `MenuManagementView` chunk

### 4. SSE Performance Test
- Dashboard에서 30개 테이블 카드 렌더링 상태 확인
- 빠른 연속 SSE 이벤트 (5초 내 10건) 발생 시 UI 반응성 확인
- 브라우저 DevTools Performance 탭으로 프레임 드롭 확인

## Performance Optimization Checklist
- [x] Route-based code splitting (lazy import)
- [x] Optimistic UI updates (상태 변경 즉시 반영)
- [x] TailwindCSS purge (미사용 CSS 제거)
- [x] Vite build optimization (minify, tree-shaking)
- [ ] 이미지 lazy loading (필요 시 추가)
- [ ] Virtual scrolling for large lists (30+ 테이블 시 필요 시 추가)
