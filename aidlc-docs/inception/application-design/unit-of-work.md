# Unit of Work Definitions

## Development Order
**Backend -> Customer Frontend -> Admin Frontend** (순차 개발, API 우선)

## Shared Code Strategy
**OpenAPI/Swagger** 스펙에서 Frontend 타입 자동 생성

---

## Unit 1: Backend API Server

| 항목 | 내용 |
|---|---|
| **Name** | backend |
| **Type** | Service (독립 배포 가능) |
| **Technology** | Node.js + Express.js + Prisma + PostgreSQL |
| **Development Order** | 1st (최우선) |
| **Responsibilities** | REST API, SSE, 인증, DB 관리, 이미지 업로드, OpenAPI 스펙 생성 |

**Scope:**
- Auth Module (관리자/테이블 로그인, JWT)
- Store Module (매장 정보, 멀티테넌시)
- Menu Module (CRUD, 이미지 업로드, 순서 관리)
- Order Module (주문 CRUD, 상태 관리, SSE 이벤트)
- Table Module (테이블 설정, 세션 관리, 이용 완료, 과거 내역)
- SSE Module (실시간 이벤트 스트리밍)
- OpenAPI/Swagger 스펙 자동 생성

**Code Organization:**
```
backend/
+-- src/
|   +-- routes/
|   |   +-- auth.js
|   |   +-- stores.js
|   |   +-- menus.js
|   |   +-- orders.js
|   |   +-- tables.js
|   |   +-- events.js
|   +-- middleware/
|   |   +-- auth.js
|   |   +-- storeContext.js
|   |   +-- errorHandler.js
|   +-- sse/
|   |   +-- sseManager.js
|   +-- prisma/
|   |   +-- schema.prisma
|   +-- uploads/
|   +-- utils/
|   +-- app.js
|   +-- server.js
+-- tests/
+-- package.json
+-- swagger.json
```

---

## Unit 2: Customer Frontend

| 항목 | 내용 |
|---|---|
| **Name** | customer-frontend |
| **Type** | Service (독립 배포 가능) |
| **Technology** | Vue.js 3 + Vite + TailwindCSS + PrimeVue + Vuex 4 |
| **Development Order** | 2nd (Backend 완료 후) |
| **Responsibilities** | 고객 주문 UI, 자동 로그인, 장바구니, 주문 생성/조회 |

**Scope:**
- Auto Login (태블릿 자동 인증)
- Menu View (카테고리별 메뉴 탐색)
- Cart (장바구니 관리, 로컬 저장)
- Order (주문 생성, 확인)
- Order History (현재 세션 주문 내역)

**Code Organization:**
```
customer-frontend/
+-- src/
|   +-- views/
|   |   +-- MenuView.vue
|   |   +-- CartView.vue
|   |   +-- OrderConfirmView.vue
|   |   +-- OrderHistoryView.vue
|   |   +-- SetupView.vue
|   +-- components/
|   |   +-- menu/
|   |   +-- cart/
|   |   +-- order/
|   |   +-- common/
|   +-- store/
|   |   +-- index.js
|   |   +-- modules/
|   +-- router/
|   +-- api/
|   +-- utils/
|   +-- App.vue
|   +-- main.js
+-- tests/
+-- package.json
```

---

## Unit 3: Admin Frontend

| 항목 | 내용 |
|---|---|
| **Name** | admin-frontend |
| **Type** | Service (독립 배포 가능) |
| **Technology** | Vue.js 3 + Vite + TailwindCSS + PrimeVue + Vuex 4 |
| **Development Order** | 3rd (Backend 완료 후, Customer와 독립) |
| **Responsibilities** | 관리자 대시보드, 주문 모니터링, 테이블/메뉴 관리 |

**Scope:**
- Admin Login (JWT 인증)
- Dashboard (실시간 주문 모니터링, SSE, 미확인 주문 알림)
- Table Management (초기 설정, 주문 삭제, 이용 완료, 과거 내역)
- Menu Management (CRUD, 이미지 업로드, 순서 조정)

**Code Organization:**
```
admin-frontend/
+-- src/
|   +-- views/
|   |   +-- LoginView.vue
|   |   +-- DashboardView.vue
|   |   +-- TableManagementView.vue
|   |   +-- MenuManagementView.vue
|   +-- components/
|   |   +-- dashboard/
|   |   +-- table/
|   |   +-- menu/
|   |   +-- common/
|   +-- store/
|   |   +-- index.js
|   |   +-- modules/
|   +-- router/
|   +-- api/
|   +-- utils/
|   +-- App.vue
|   +-- main.js
+-- tests/
+-- package.json
```
