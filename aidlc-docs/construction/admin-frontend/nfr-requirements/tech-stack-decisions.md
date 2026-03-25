# Admin Frontend - Tech Stack Decisions

## Core Framework

| Technology | Version | Decision Rationale |
|---|---|---|
| Vue.js | 3.x | SPA 프레임워크, INCEPTION에서 결정 |
| TypeScript | 5.x | 타입 안전성, 개발 생산성 |
| Vite | 5.x | 빌드 도구, HMR, Vue 3 최적 지원 |

## UI Framework

| Technology | Version | Decision Rationale |
|---|---|---|
| TailwindCSS | 3.x | 유틸리티 CSS, 빠른 스타일링 |
| PrimeVue | 4.x | Vue 3 전용 UI 컴포넌트 라이브러리 |

### PrimeVue 사용 컴포넌트 (개별 import)
- **Dialog**: 모달 다이얼로그 (주문 상세, 과거 내역, 메뉴 폼)
- **ConfirmDialog**: 확인 팝업 (삭제, 상태 변경, 이용 완료)
- **Toast**: 성공/에러 알림
- **DataTable**: 테이블 관리 목록
- **Button**: 공통 버튼
- **InputText / InputNumber**: 폼 입력
- **Dropdown**: 카테고리 선택, 테이블 필터
- **FileUpload**: 이미지 업로드
- **Calendar**: 날짜 필터 (과거 내역)
- **Card**: 테이블 카드, 메뉴 카드
- **Sidebar**: 네비게이션 사이드바
- **Badge**: SSE 상태 표시
- **Tag**: 주문 상태 태그

## State Management

| Technology | Version | Decision Rationale |
|---|---|---|
| Vuex | 4.x | 상태 관리, INCEPTION에서 결정 |

### Store Module 구조
```
store/
+-- index.ts          # Root store
+-- modules/
    +-- auth.ts       # 인증 상태
    +-- dashboard.ts  # 대시보드 (주문, SSE)
    +-- tables.ts     # 테이블 관리
    +-- menus.ts      # 메뉴/카테고리 관리
```

## Routing

| Technology | Version | Decision Rationale |
|---|---|---|
| Vue Router | 4.x | SPA 라우팅, Vue 3 호환 |

### Route Configuration
- Lazy loading: 라우트별 동적 import
- Navigation Guard: 인증 체크 (beforeEach)
- Redirect: 인증 미완료 시 /login, 인증 완료 시 /dashboard

## HTTP Client

| Technology | Version | Decision Rationale |
|---|---|---|
| Axios | 1.x | HTTP 클라이언트, 인터셉터 지원 |

### Axios Configuration
- Base URL: 환경변수 (VITE_API_BASE_URL)
- Request Interceptor: JWT 토큰 자동 주입
- Response Interceptor: 401 처리 (자동 로그아웃)

## Real-time Communication

| Technology | Version | Decision Rationale |
|---|---|---|
| EventSource (Native) | Browser API | SSE 수신, 별도 라이브러리 불필요 |

### SSE Configuration
- Native EventSource API 사용
- 자동 재연결: 3초 간격, 최대 10회
- 이벤트 타입별 핸들러 등록

## Testing

| Technology | Version | Decision Rationale |
|---|---|---|
| Vitest | 1.x | Vite 네이티브, 빠른 실행 |
| Vue Test Utils | 2.x | Vue 3 컴포넌트 테스트 |
| @vue/test-utils | 2.x | 공식 테스트 유틸리티 |

### Test Strategy
- **Unit Tests**: Vuex Store modules (actions, mutations, getters)
- **Component Tests**: Vue Test Utils로 컴포넌트 렌더링/인터랙션 테스트
- **Location**: `tests/unit/`, `tests/components/`

## Development Tools

| Technology | Purpose |
|---|---|
| ESLint | 코드 린팅 |
| Prettier | 코드 포매팅 |
| Vite Dev Server | 개발 서버 + HMR |
| Vite Proxy | API 프록시 (CORS 우회) |

## Environment Configuration

```
.env.development:
  VITE_API_BASE_URL=http://localhost:3000/api

.env.production:
  VITE_API_BASE_URL=/api
```

## Browser Target

| Browser | Version | Support |
|---|---|---|
| Chrome | 120+ | Primary (유일 지원 대상) |

### Vite Build Target
```javascript
// vite.config.ts
build: {
  target: 'chrome120'
}
```

## Project Structure (Final)

```
admin-frontend/
+-- public/
+-- src/
|   +-- api/
|   |   +-- client.ts
|   |   +-- auth.ts
|   |   +-- orders.ts
|   |   +-- tables.ts
|   |   +-- menus.ts
|   |   +-- categories.ts
|   |   +-- sse.ts
|   +-- components/
|   |   +-- common/
|   |   |   +-- ConfirmDialog.vue
|   |   |   +-- SidebarNav.vue
|   |   +-- dashboard/
|   |   |   +-- DashboardHeader.vue
|   |   |   +-- TableCardGrid.vue
|   |   |   +-- TableCard.vue
|   |   |   +-- OrderDetailModal.vue
|   |   |   +-- OrderItemList.vue
|   |   |   +-- OrderStatusControl.vue
|   |   +-- table/
|   |   |   +-- TableList.vue
|   |   |   +-- TableRow.vue
|   |   |   +-- TableSetupForm.vue
|   |   |   +-- ExistingTableList.vue
|   |   |   +-- OrderHistoryModal.vue
|   |   |   +-- HistoryDateFilter.vue
|   |   |   +-- HistorySessionGroup.vue
|   |   +-- menu/
|   |       +-- CategorySidebar.vue
|   |       +-- CategoryItem.vue
|   |       +-- CategoryForm.vue
|   |       +-- MenuGrid.vue
|   |       +-- MenuCard.vue
|   |       +-- MenuSortControls.vue
|   |       +-- MenuFormModal.vue
|   |       +-- ImageUploader.vue
|   +-- router/
|   |   +-- index.ts
|   +-- store/
|   |   +-- index.ts
|   |   +-- modules/
|   |       +-- auth.ts
|   |       +-- dashboard.ts
|   |       +-- tables.ts
|   |       +-- menus.ts
|   +-- types/
|   |   +-- index.ts
|   +-- utils/
|   |   +-- jwt.ts
|   +-- views/
|   |   +-- LoginView.vue
|   |   +-- DashboardView.vue
|   |   +-- TableManagementView.vue
|   |   +-- TableSetupView.vue
|   |   +-- MenuManagementView.vue
|   +-- App.vue
|   +-- AppLayout.vue
|   +-- main.ts
+-- tests/
|   +-- unit/
|   |   +-- store/
|   +-- components/
+-- .env.development
+-- .env.production
+-- index.html
+-- package.json
+-- tsconfig.json
+-- vite.config.ts
+-- tailwind.config.js
+-- postcss.config.js
+-- .eslintrc.cjs
+-- .prettierrc
```
