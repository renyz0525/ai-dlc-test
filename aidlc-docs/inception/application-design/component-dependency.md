# Component Dependency

## Dependency Matrix

### Backend Module Dependencies

| Module | Depends On |
|---|---|
| Auth | Prisma (User/Table 조회), JWT library |
| Store | Prisma (Store 조회) |
| Menu | Prisma (Menu CRUD), Auth middleware, Multer (이미지 업로드) |
| Order | Prisma (Order CRUD), Auth middleware, SSE Module |
| Table | Prisma (Table/Order/OrderHistory CRUD), Auth middleware, SSE Module |
| SSE | Auth middleware (연결 인증) |

### Frontend -> Backend Dependencies

| Frontend Component | Backend API |
|---|---|
| Customer Auth | POST /api/auth/table/login |
| Customer Menu View | GET /api/stores/:storeId/menus |
| Customer Cart | (로컬 전용, API 호출 없음) |
| Customer Order | POST /api/stores/:storeId/tables/:tableId/orders |
| Customer Order History | GET /api/stores/:storeId/tables/:tableId/orders |
| Admin Auth | POST /api/auth/admin/login |
| Admin Dashboard | GET /api/stores/:storeId/orders, GET /api/stores/:storeId/events (SSE), PATCH /api/stores/:storeId/orders/:orderId/status |
| Admin Table Mgmt | GET/POST /api/stores/:storeId/tables, POST .../complete, GET .../history |
| Admin Menu Mgmt | GET/POST/PUT/DELETE /api/stores/:storeId/menus |

## Data Flow

```
+------------------+     +------------------+     +------------------+
|   Customer       |     |   Backend API    |     |   Admin          |
|   Frontend       |     |   (Express.js)   |     |   Frontend       |
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
| Menu View -------+---->| Menu Handler     |<----+- Menu Mgmt      |
|                  | GET |                  | CRUD|                  |
| Cart (local)     |     |                  |     |                  |
|                  |     |                  |     |                  |
| Order -----------+---->| Order Handler ---+---->| Dashboard (SSE)  |
|                  | POST|       |          | SSE |                  |
| Order History ---+---->|       v          |     |                  |
|                  | GET | Prisma (PG)      |     | Table Mgmt ------+
|                  |     |       |          |     |                  |
| Auto Login ------+---->| Auth Handler     |<----+- Admin Login     |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
                               |
                               v
                         +----------+
                         |PostgreSQL|
                         +----------+
```

## Communication Patterns

| Pattern | Used By | Description |
|---|---|---|
| REST (Request/Response) | 모든 CRUD 작업 | 표준 HTTP 요청/응답 |
| SSE (Server Push) | Order Monitor | 서버 -> Admin 단방향 실시간 스트리밍 |
| Local Storage | Customer Cart | 클라이언트 측 장바구니 영속화 |
| JWT Token | Auth | Stateless 인증 토큰 |
