# Unit of Work Plan

## Plan Overview
테이블오더 서비스를 독립적인 개발 유닛으로 분해합니다.
Application Design에서 3개 별도 프로젝트로 결정되었으므로, 유닛 간 개발 순서와 의존성을 결정합니다.

---

## Questions

### Question 1
3개 유닛의 개발 순서를 어떻게 하시겠습니까?

A) Backend 먼저 -> Customer Frontend -> Admin Frontend (API 우선 개발)
B) Backend + Customer Frontend 동시 -> Admin Frontend (고객 경험 우선)
C) Backend + 양쪽 Frontend 동시 개발 (Mock API 활용, 병렬 최대화)
D) Other (please describe after [Answer]: tag below)

[Answer]:A

### Question 2
유닛 간 공유 코드(타입 정의, API 클라이언트 등)를 어떻게 관리하시겠습니까?

A) 공유 패키지 없음 - 각 프로젝트에서 독립적으로 타입 정의
B) 공유 types 패키지 생성 (모노레포 내 shared/ 디렉토리)
C) Backend의 API 스펙에서 Frontend 타입 자동 생성 (OpenAPI/Swagger)
D) Other (please describe after [Answer]: tag below)

[Answer]:C

---

## Generation Execution Plan

- [x] Step 1: 유닛 정의 (unit-of-work.md)
  - [x] Unit 1: Backend API Server 정의
  - [x] Unit 2: Customer Frontend 정의
  - [x] Unit 3: Admin Frontend 정의
  - [x] 각 유닛의 책임, 범위, 기술 스택 명시

- [x] Step 2: 유닛 의존성 매핑 (unit-of-work-dependency.md)
  - [x] 유닛 간 의존성 매트릭스
  - [x] 개발 순서 및 병렬화 가능 구간

- [x] Step 3: 스토리-유닛 매핑 (unit-of-work-story-map.md)
  - [x] 12개 User Story를 3개 유닛에 매핑
  - [x] 유닛 간 공유 스토리 식별

- [x] Step 4: 코드 조직 전략 문서화
  - [x] 디렉토리 구조 확정
  - [x] 공유 코드 관리 방식 확정 (OpenAPI/Swagger)
