# Services Design

## Architecture Overview

Simple Structure (Route Handler - DB Access) 패턴을 사용합니다.
- **Route Handler**: 요청 검증, 비즈니스 로직, 응답 구성
- **Prisma Client**: DB 접근 (ORM)
- **Middleware**: 인증, 매장 컨텍스트, 에러 처리

```
Client Request
    |
    v
[Express Router]
    |
    v
[Middleware Chain] --> Auth Middleware --> Store Context Middleware
    |
    v
[Route Handler] --> Business Logic + Prisma DB Access
    |
    v
[Response]
```

## Service Orchestration Patterns

### 1. 주문 생성 Flow
```
Customer -> POST /orders
  -> Auth Middleware (테이블 토큰 검증)
  -> Store Context Middleware (storeId 확인)
  -> Order Route Handler:
    1. 요청 데이터 검증
    2. 메뉴 유효성 확인 (Prisma)
    3. 주문 생성 (Prisma)
    4. SSE 이벤트 발행 (SSE Module)
    5. 응답 반환
```

### 2. 실시간 모니터링 Flow
```
Admin -> GET /events (SSE)
  -> Auth Middleware (JWT 검증)
  -> SSE Module:
    1. 연결 등록 (매장별)
    2. 이벤트 스트림 유지
    3. 주문 생성/상태변경 시 브로드캐스트
```

### 3. 이용 완료 Flow
```
Admin -> POST /tables/:tableId/complete
  -> Auth Middleware (JWT 검증)
  -> Table Route Handler:
    1. 현재 세션 주문 조회 (Prisma)
    2. OrderHistory로 이동 (Prisma transaction)
    3. 현재 주문 삭제 (Prisma transaction)
    4. 세션 종료 처리 (Prisma)
    5. SSE 이벤트 발행
    6. 응답 반환
```

### 4. 이미지 업로드 Flow
```
Admin -> POST /menus (multipart/form-data)
  -> Auth Middleware (JWT 검증)
  -> Multer Middleware (파일 처리)
  -> Menu Route Handler:
    1. 이미지 파일 로컬 저장
    2. 메뉴 데이터 + 이미지 경로 저장 (Prisma)
    3. 응답 반환
```

## Middleware Chain

| Order | Middleware | Purpose |
|---|---|---|
| 1 | CORS | Cross-origin 요청 허용 |
| 2 | Body Parser | JSON/multipart 요청 파싱 |
| 3 | Auth | JWT/테이블 토큰 검증 |
| 4 | Store Context | storeId 검증 및 주입 |
| 5 | Error Handler | 전역 에러 처리 |

## SSE Event Types

| Event | Trigger | Payload |
|---|---|---|
| order:created | 고객 주문 생성 | { orderId, tableId, items, total, createdAt } |
| order:statusChanged | 관리자 상태 변경 | { orderId, status } |
| order:deleted | 관리자 주문 삭제 | { orderId, tableId } |
| table:completed | 관리자 이용 완료 | { tableId } |
