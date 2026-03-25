# Backend Functional Design Plan

## Unit Context
- **Unit**: Backend API Server
- **Stories**: US-C01, US-C02, US-C04, US-C05, US-A01~A07 (11개)
- **Tech**: Node.js + Express.js + Prisma + PostgreSQL
- **Pattern**: Simple Structure (Route Handler - DB Access)

---

## Questions

### Question 1
주문 상태 전이(State Machine) 규칙을 어떻게 설정하시겠습니까?

A) 단방향만 허용: 대기중 -> 준비중 -> 완료 (되돌리기 불가)
B) 유연한 전이: 대기중 <-> 준비중 -> 완료 (준비중에서 대기중으로 되돌리기 가능)
C) 완전 자유: 어떤 상태에서든 다른 상태로 변경 가능
D) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 2
테이블 세션(TableSession) 시작 시점은 언제입니까?

A) 테이블 태블릿 로그인 시 자동 시작
B) 해당 테이블에서 첫 주문 생성 시 자동 시작
C) 관리자가 수동으로 세션 시작
D) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 3
관리자 로그인 시도 제한 정책은 어떻게 하시겠습니까?

A) 5회 실패 시 15분 잠금
B) 3회 실패 시 30분 잠금
C) 10회 실패 시 1시간 잠금
D) AI가 적절히 판단
E) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 4
메뉴 가격 범위 검증 기준은 어떻게 하시겠습니까?

A) 최소 100원 ~ 최대 1,000,000원
B) 최소 0원(무료 가능) ~ 최대 제한 없음
C) 최소 1,000원 ~ 최대 500,000원
D) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 5
이용 완료 시 OrderHistory에 저장하는 방식은 어떻게 하시겠습니까?

A) 주문 데이터를 JSON으로 직렬화하여 단일 레코드로 저장 (비정규화, 단순)
B) OrderHistory 별도 테이블에 정규화하여 저장 (Order/OrderItem 구조 유지)
C) 기존 Order 테이블에 유지하되 세션 종료 플래그만 추가 (이동 없음, archived 필드)
D) Other (please describe after [Answer]: tag below)

[Answer]:

---

## Execution Plan

- [ ] Step 1: Domain Entity 상세 설계 (domain-entities.md)
  - [ ] Store, User, Table, TableSession 엔티티
  - [ ] Category, Menu 엔티티
  - [ ] Order, OrderItem 엔티티
  - [ ] OrderHistory 엔티티
  - [ ] Prisma schema 초안

- [ ] Step 2: Business Logic Model 설계 (business-logic-model.md)
  - [ ] 인증 로직 (관리자/테이블)
  - [ ] 주문 생성 로직
  - [ ] 주문 상태 전이 로직
  - [ ] 테이블 세션 라이프사이클
  - [ ] 이용 완료 로직
  - [ ] SSE 이벤트 발행 로직

- [ ] Step 3: Business Rules 정의 (business-rules.md)
  - [ ] 인증 규칙 (JWT, 로그인 제한)
  - [ ] 메뉴 검증 규칙
  - [ ] 주문 검증 규칙
  - [ ] 테이블 세션 규칙
  - [ ] 멀티테넌시 규칙
