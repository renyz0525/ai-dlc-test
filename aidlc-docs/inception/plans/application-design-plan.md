# Application Design Plan

## Plan Overview
테이블오더 서비스의 고수준 컴포넌트 식별 및 서비스 레이어 설계 계획입니다.

---

## Design Questions

### Question 1
Backend API의 레이어 구조를 어떻게 설계하시겠습니까?

A) 3-Layer (Controller - Service - Repository) - 전통적이고 명확한 역할 분리
B) Clean Architecture (Controller - UseCase - Repository) - 비즈니스 로직 독립성 강조
C) Simple Structure (Route Handler - DB Access) - 최소 레이어, 빠른 개발
D) Other (please describe after [Answer]: tag below)

[Answer]:C

### Question 2
데이터베이스 접근 방식은 어떻게 하시겠습니까?

A) ORM 사용 (Sequelize, TypeORM 등) - 객체 매핑, 마이그레이션 지원
B) Query Builder 사용 (Knex.js) - SQL에 가깝지만 빌더 패턴
C) Raw SQL (pg 드라이버 직접) - 최대 성능, 직접 쿼리 작성
D) Prisma - 타입 안전, 스키마 기반 코드 생성
E) Other (please describe after [Answer]: tag below)

[Answer]:D

### Question 3
Frontend 상태 관리는 어떻게 하시겠습니까? (Vue.js 기반)

A) Pinia (Vue 공식 상태 관리, 가벼움, TypeScript 친화적)
B) Vuex 4 (전통적 상태 관리, 대규모 앱에 적합)
C) Composables만 사용 (별도 상태 관리 라이브러리 없이 Vue 3 Composition API 활용)
D) Other (please describe after [Answer]: tag below)

[Answer]:B

### Question 4
API 라우팅 설계 패턴은 어떻게 하시겠습니까?

A) RESTful Resource 기반 (예: /api/stores/:storeId/tables/:tableId/orders)
B) Flat 구조 (예: /api/orders, /api/menus - 쿼리 파라미터로 필터링)
C) AI가 기능별로 최적의 구조를 판단
D) Other (please describe after [Answer]: tag below)

[Answer]:C

---

## Design Execution Plan

답변 승인 후 아래 순서로 설계 산출물을 생성합니다.

- [x] Step 1: 컴포넌트 식별 및 정의 (components.md)
  - [x] Backend 컴포넌트 식별 (Auth, Menu, Order, Table, Store, SSE)
  - [x] Customer Frontend 컴포넌트 식별
  - [x] Admin Frontend 컴포넌트 식별
  - [x] 각 컴포넌트 책임 및 인터페이스 정의

- [x] Step 2: 컴포넌트 메서드 설계 (component-methods.md)
  - [x] Backend 서비스별 메서드 시그니처
  - [x] Frontend 주요 composable/store 메서드

- [x] Step 3: 서비스 레이어 설계 (services.md)
  - [x] Backend 서비스 오케스트레이션 패턴
  - [x] 서비스 간 상호작용 정의

- [x] Step 4: 컴포넌트 의존성 매핑 (component-dependency.md)
  - [x] 의존성 매트릭스
  - [x] 데이터 흐름도

- [x] Step 5: 통합 설계 문서 (application-design.md)
  - [x] 전체 설계 통합 및 검증
