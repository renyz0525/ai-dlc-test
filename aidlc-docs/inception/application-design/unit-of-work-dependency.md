# Unit of Work Dependencies

## Dependency Matrix

| Unit | Depends On | Depended By |
|---|---|---|
| Backend | PostgreSQL (external) | Customer Frontend, Admin Frontend |
| Customer Frontend | Backend API | - |
| Admin Frontend | Backend API (REST + SSE) | - |

## Development Sequence

```
Phase 1: Backend API Server
  |
  +--> OpenAPI/Swagger 스펙 생성
  |
  v
Phase 2: Customer Frontend
  |  (Backend API 사용, OpenAPI에서 타입 생성)
  v
Phase 3: Admin Frontend
     (Backend API + SSE 사용, OpenAPI에서 타입 생성)
```

## Dependency Details

### Backend -> Customer Frontend
- **Type**: API dependency (REST)
- **Interface**: OpenAPI/Swagger spec
- **Endpoints Used**: Auth (table login), Menu (조회), Order (생성/조회)
- **Shared Types**: API 스펙에서 자동 생성

### Backend -> Admin Frontend
- **Type**: API dependency (REST + SSE)
- **Interface**: OpenAPI/Swagger spec + SSE event stream
- **Endpoints Used**: Auth (admin login), Menu (CRUD), Order (조회/상태변경/삭제), Table (관리), SSE (이벤트 스트림)
- **Shared Types**: API 스펙에서 자동 생성

### Customer Frontend <-> Admin Frontend
- **Type**: No direct dependency
- **Indirect**: 동일 Backend API를 통한 데이터 공유 (주문 생성 -> 실시간 모니터링)

## Parallelization

| Phase | Units | 비고 |
|---|---|---|
| Phase 1 | Backend | API 완성 필수 (다른 유닛의 기반) |
| Phase 2 | Customer Frontend | Backend API 완료 후 시작 |
| Phase 3 | Admin Frontend | Backend API 완료 후 시작 (Customer와 독립 가능하나 순차 진행) |

## Integration Points

| Integration | Units | Protocol | Description |
|---|---|---|---|
| 고객 주문 -> 관리자 알림 | Backend (중개) | SSE | 고객 주문 생성 시 Backend가 SSE로 Admin에 전달 |
| 관리자 상태 변경 -> 고객 조회 | Backend (중개) | REST | 관리자가 상태 변경 후 고객이 조회 시 반영 |
| OpenAPI 타입 공유 | Backend -> Frontends | 코드 생성 | swagger.json에서 TypeScript 타입 자동 생성 |
