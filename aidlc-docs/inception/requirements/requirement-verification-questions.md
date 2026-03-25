# Requirements Verification Questions

Please answer the following questions to help clarify the technical and functional requirements for the table order service.

## Question 1
Backend 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Java + Spring Boot
B) Node.js + Express/NestJS
C) Python + FastAPI/Django
D) Go + Gin/Echo
E) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 2
Frontend 기술 스택으로 어떤 것을 사용하시겠습니까? (고객용 UI + 관리자용 UI)

A) React (JavaScript/TypeScript)
B) Vue.js (JavaScript/TypeScript)
C) Next.js (React 기반 SSR)
D) Angular
E) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL/MariaDB
C) MongoDB (NoSQL)
D) SQLite (개발/소규모용)
E) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 4
배포 환경은 어떻게 계획하고 계십니까?

A) AWS (EC2, ECS, Lambda 등)
B) Docker Compose (로컬/온프레미스)
C) Kubernetes (EKS, GKE 등)
D) 배포 환경은 아직 미정 (로컬 개발 환경만 우선 구성)
E) Other (please describe after [Answer]: tag below)

[Answer]:D

## Question 5
메뉴 이미지 관리 방식은 어떻게 하시겠습니까?

A) 외부 URL 직접 입력 (이미지 업로드 없음)
B) 서버에 이미지 파일 업로드 (로컬 스토리지)
C) 클라우드 스토리지 업로드 (S3, GCS 등)
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 6
예상 동시 접속 매장 수 및 테이블 수 규모는 어느 정도입니까?

A) 소규모 - 1개 매장, 10개 이하 테이블
B) 중규모 - 1~5개 매장, 총 50개 이하 테이블
C) 대규모 - 다수 매장, 100개 이상 테이블
D) MVP 단계에서는 규모를 고려하지 않음
E) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 7
고객용 UI와 관리자용 UI를 하나의 프로젝트로 구성할까요, 별도 프로젝트로 분리할까요?

A) 하나의 프로젝트 (모노레포 또는 단일 앱에서 라우팅으로 분리)
B) 별도 프로젝트 (고객용, 관리자용 각각 독립 배포)
C) AI가 최적의 구조를 판단해서 결정
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 8
매장(Store) 데이터는 어떻게 관리됩니까? (멀티테넌시 관점)

A) 단일 매장만 지원 (하나의 시스템 = 하나의 매장)
B) 멀티 매장 지원 (하나의 시스템에서 여러 매장 관리, 매장별 데이터 격리)
C) MVP에서는 단일 매장, 향후 멀티 매장 확장 가능한 구조
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 9: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용하시겠습니까?

A) Yes - 모든 SECURITY 규칙을 blocking constraint로 적용 (production-grade 애플리케이션에 권장)
B) No - SECURITY 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
C) Other (please describe after [Answer]: tag below)

[Answer]:B
