# Admin Frontend - Code Generation Plan

## Unit Context
- **Unit**: Admin Frontend (Unit 3)
- **Project Type**: Greenfield, Multi-unit (별도 프로젝트)
- **Technology**: Vue.js 3 + Vite + TypeScript + TailwindCSS + PrimeVue 4 + Vuex 4
- **Workspace Root**: /Users/yongzher/Desktop/ai-dlc-test-admin-fe
- **Code Location**: Workspace root (admin-frontend 구조)

## Story Coverage
| Story ID | Story Name | Coverage |
|---|---|---|
| US-A01 | 매장 인증 | Steps 4, 5, 6, 7 |
| US-A02 | 실시간 주문 모니터링 | Steps 5, 6, 8, 9 |
| US-A03 | 테이블 초기 설정 | Steps 5, 6, 10 |
| US-A04 | 주문 삭제 | Steps 5, 6, 8 |
| US-A05 | 테이블 세션 종료 | Steps 5, 6, 10 |
| US-A06 | 과거 주문 내역 조회 | Steps 5, 6, 10 |
| US-A07 | 메뉴 관리 | Steps 5, 6, 11 |

## Dependencies
- Backend API (REST + SSE) - 개발 중 Vite proxy로 연결 또는 Mock 데이터 활용
- OpenAPI 타입은 수동 TypeScript 인터페이스로 대체 (types/index.ts)

---

## Generation Steps

### Step 1: Project Scaffolding & Configuration
- [x] Vite + Vue 3 + TypeScript 프로젝트 초기화 (package.json, tsconfig.json, vite.config.ts)
- [x] TailwindCSS 설정 (tailwind.config.js, postcss.config.js)
- [x] PrimeVue 4 + Aura 테마 설정
- [x] ESLint + Prettier 설정
- [x] 환경변수 파일 (.env.development, .env.production)
- [x] index.html

### Step 2: TypeScript Types & Interfaces
- [x] src/types/index.ts - 모든 도메인 엔티티, DTO, API 응답, SSE 이벤트 타입

### Step 3: API Client Layer
- [x] src/api/client.ts - Axios 인스턴스 (인터셉터 포함)
- [x] src/api/auth.ts - 인증 API
- [x] src/api/orders.ts - 주문 API
- [x] src/api/tables.ts - 테이블 API
- [x] src/api/menus.ts - 메뉴 API
- [x] src/api/categories.ts - 카테고리 API
- [x] src/api/sse.ts - SSE Manager 클래스

### Step 4: Vuex Store Modules
- [x] src/store/index.ts - Root store
- [x] src/store/modules/auth.ts - 인증 상태 (US-A01)
- [x] src/store/modules/dashboard.ts - 대시보드 + SSE (US-A02, US-A04)
- [x] src/store/modules/tables.ts - 테이블 관리 (US-A03, US-A05, US-A06)
- [x] src/store/modules/menus.ts - 메뉴/카테고리 관리 (US-A07)

### Step 5: Vuex Store Unit Tests
- [x] tests/unit/store/auth.spec.ts
- [x] tests/unit/store/dashboard.spec.ts
- [x] tests/unit/store/tables.spec.ts
- [x] tests/unit/store/menus.spec.ts

### Step 6: Utility Modules
- [x] src/utils/jwt.ts - JWT decode/만료 확인

### Step 7: Router & App Layout
- [x] src/router/index.ts - Vue Router (라우트 정의, Guard)
- [x] src/App.vue - Root 컴포넌트
- [x] src/AppLayout.vue - 인증 후 레이아웃 (사이드바 + 콘텐츠)
- [x] src/main.ts - 앱 엔트리포인트

### Step 8: Common Components
- [x] src/components/common/SidebarNav.vue - 왼쪽 사이드바 네비게이션
- [x] src/components/common/ConfirmDialog.vue - 공통 확인 다이얼로그 (PrimeVue 래퍼)

### Step 9: Login View
- [x] src/views/LoginView.vue - 로그인 페이지 (US-A01)
- [x] src/components/auth/LoginForm.vue - 로그인 폼 컴포넌트

### Step 10: Dashboard View & Components
- [x] src/views/DashboardView.vue - 대시보드 페이지 (US-A02)
- [x] src/components/dashboard/DashboardHeader.vue - 헤더 (필터, SSE 상태)
- [x] src/components/dashboard/TableCardGrid.vue - 테이블 카드 그리드
- [x] src/components/dashboard/TableCard.vue - 테이블 카드
- [x] src/components/dashboard/OrderDetailModal.vue - 주문 상세 모달
- [x] src/components/dashboard/OrderItemList.vue - 주문 항목 목록
- [x] src/components/dashboard/OrderStatusControl.vue - 상태 변경 컨트롤

### Step 11: Table Management View & Components
- [x] src/views/TableManagementView.vue - 테이블 관리 (US-A03, A04, A05, A06)
- [x] src/components/table/TableList.vue - 테이블 목록
- [x] src/components/table/TableRow.vue - 테이블 행
- [x] src/components/table/OrderHistoryModal.vue - 과거 내역 모달
- [x] src/components/table/HistoryDateFilter.vue - 날짜 필터
- [x] src/components/table/HistorySessionGroup.vue - 세션 그룹
- [x] src/views/TableSetupView.vue - 테이블 설정 페이지 (US-A03)
- [x] src/components/table/ExistingTableList.vue - 기존 테이블 목록
- [x] src/components/table/TableSetupForm.vue - 설정 폼

### Step 12: Menu Management View & Components
- [x] src/views/MenuManagementView.vue - 메뉴 관리 (US-A07)
- [x] src/components/menu/CategorySidebar.vue - 카테고리 사이드바
- [x] src/components/menu/CategoryItem.vue - 카테고리 항목
- [x] src/components/menu/CategoryForm.vue - 카테고리 폼
- [x] src/components/menu/MenuGrid.vue - 메뉴 그리드
- [x] src/components/menu/MenuCard.vue - 메뉴 카드
- [x] src/components/menu/MenuSortControls.vue - 순서 조정 컨트롤
- [x] src/components/menu/MenuFormModal.vue - 메뉴 폼 모달
- [x] src/components/menu/ImageUploader.vue - 이미지 업로더

### Step 13: Component Unit Tests
- [x] tests/components/LoginForm.spec.ts
- [x] tests/components/TableCard.spec.ts
- [x] tests/components/OrderStatusControl.spec.ts
- [x] tests/components/MenuCard.spec.ts
- [x] tests/components/SidebarNav.spec.ts
- [x] tests/components/ImageUploader.spec.ts

### Step 14: API Client Unit Tests
- [x] tests/unit/api/client.spec.ts
- [x] tests/unit/api/sse.spec.ts

### Step 15: Documentation & Summary
- [x] aidlc-docs/construction/admin-frontend/code/code-generation-summary.md

---

## Total: 15 Steps, ~60+ files
## Story Traceability: All 7 Admin stories (US-A01 ~ US-A07) covered
