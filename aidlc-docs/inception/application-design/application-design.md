# Application Design - Consolidated

## Architecture Summary

| Layer | Technology | Pattern |
|---|---|---|
| Backend | Node.js + Express.js | Simple Structure (Route Handler - DB Access) |
| DB Access | Prisma ORM | Schema-first, type-safe |
| Database | PostgreSQL | 멀티테넌시 (store_id 기반) |
| Customer Frontend | Vue.js + Vite + TailwindCSS + PrimeVue | Vuex 4 상태 관리 |
| Admin Frontend | Vue.js + Vite + TailwindCSS + PrimeVue | Vuex 4 상태 관리 |
| Real-time | Server-Sent Events (SSE) | 서버 -> 클라이언트 단방향 |
| Authentication | JWT | 관리자 + 테이블 태블릿 |

## Project Structure (3 Projects)

```
table-order/
+-- backend/             # Express.js API Server
|   +-- src/
|   |   +-- routes/      # Route handlers
|   |   +-- middleware/   # Auth, store context, error handling
|   |   +-- prisma/      # Prisma schema & migrations
|   |   +-- sse/         # SSE event management
|   |   +-- uploads/     # Image upload storage
|   |   +-- utils/       # Shared utilities
|   |   +-- app.js       # Express app setup
|   |   +-- server.js    # Server entry point
|   +-- package.json
|
+-- customer-frontend/   # Vue.js Customer App
|   +-- src/
|   |   +-- views/       # Page components
|   |   +-- components/  # Reusable UI components
|   |   +-- store/       # Vuex 4 store modules
|   |   +-- router/      # Vue Router
|   |   +-- api/         # API client
|   |   +-- utils/       # Utilities
|   +-- package.json
|
+-- admin-frontend/      # Vue.js Admin App
|   +-- src/
|   |   +-- views/       # Page components
|   |   +-- components/  # Reusable UI components
|   |   +-- store/       # Vuex 4 store modules
|   |   +-- router/      # Vue Router
|   |   +-- api/         # API client
|   |   +-- utils/       # Utilities
|   +-- package.json
```

## Backend Modules

| Module | Routes | Key Responsibilities |
|---|---|---|
| Auth | /api/auth/* | 관리자/테이블 로그인, JWT 발급, 토큰 검증 |
| Store | /api/stores/* | 매장 정보 조회, 멀티테넌시 컨텍스트 |
| Menu | /api/stores/:storeId/menus/* | 메뉴 CRUD, 이미지 업로드, 순서 관리 |
| Order | /api/stores/:storeId/orders/*, /api/stores/:storeId/tables/:tableId/orders | 주문 CRUD, 상태 관리 |
| Table | /api/stores/:storeId/tables/* | 테이블 설정, 세션 관리, 이용 완료 |
| SSE | /api/stores/:storeId/events | 실시간 이벤트 스트리밍 |

## Data Model (High-Level)

| Entity | Key Fields | Relations |
|---|---|---|
| Store | id, name, address | has many Tables, Menus, Users |
| User (Admin) | id, storeId, username, passwordHash | belongs to Store |
| Table | id, storeId, tableNumber, passwordHash, currentSessionId | belongs to Store, has many Orders |
| TableSession | id, tableId, storeId, startedAt, completedAt | belongs to Table |
| Category | id, storeId, name, sortOrder | belongs to Store, has many Menus |
| Menu | id, storeId, categoryId, name, price, description, imageUrl, sortOrder | belongs to Category |
| Order | id, storeId, tableId, sessionId, status, totalAmount, createdAt | belongs to Table/Session, has many OrderItems |
| OrderItem | id, orderId, menuId, menuName, quantity, unitPrice | belongs to Order |
| OrderHistory | id, storeId, tableId, sessionId, orderData (JSON), completedAt | 이용 완료 후 이력 |

## Communication Patterns

- **REST**: 모든 CRUD 작업 (Request/Response)
- **SSE**: 실시간 주문 모니터링 (Server -> Admin 단방향)
- **Local Storage**: 고객 장바구니 영속화
- **JWT Token**: Stateless 인증

## Related Documents
- [components.md](components.md) - 컴포넌트 상세 정의
- [component-methods.md](component-methods.md) - 메서드 시그니처
- [services.md](services.md) - 서비스 오케스트레이션
- [component-dependency.md](component-dependency.md) - 의존성 매핑
