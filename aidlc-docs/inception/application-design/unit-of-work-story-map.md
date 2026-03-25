# Unit of Work - Story Mapping

## Story to Unit Mapping

| Story ID | Story Name | Backend | Customer FE | Admin FE |
|---|---|---|---|---|
| US-C01 | 테이블 태블릿 자동 로그인 | O (auth API) | O (auto login UI) | - |
| US-C02 | 메뉴 조회 및 탐색 | O (menu API) | O (menu view UI) | - |
| US-C03 | 장바구니 관리 | - | O (local only) | - |
| US-C04 | 주문 생성 | O (order API + SSE) | O (order UI) | - |
| US-C05 | 주문 내역 조회 | O (order API) | O (history UI) | - |
| US-A01 | 매장 인증 | O (auth API) | - | O (login UI) |
| US-A02 | 실시간 주문 모니터링 | O (order API + SSE) | - | O (dashboard UI) |
| US-A03 | 테이블 초기 설정 | O (table API) | - | O (table mgmt UI) |
| US-A04 | 주문 삭제 | O (order API) | - | O (table mgmt UI) |
| US-A05 | 테이블 세션 종료 | O (table API) | - | O (table mgmt UI) |
| US-A06 | 과거 주문 내역 조회 | O (table API) | - | O (table mgmt UI) |
| US-A07 | 메뉴 관리 | O (menu API) | - | O (menu mgmt UI) |

## Unit별 Story Count

| Unit | Total Stories | High Priority | Medium | Low |
|---|---|---|---|---|
| Backend | 11 | 9 | 1 | 1 |
| Customer Frontend | 5 | 4 | 1 | 0 |
| Admin Frontend | 7 | 5 | 1 | 1 |

**Note**: US-C03 (장바구니)은 클라이언트 전용이므로 Backend에 매핑되지 않음.

## Cross-Unit Stories

다음 스토리들은 여러 유닛에 걸쳐 구현됩니다:

| Story | 관련 Units | Integration Point |
|---|---|---|
| US-C04 (주문 생성) | Backend + Customer FE | 고객이 주문 -> Backend 저장 -> SSE로 Admin에 전달 |
| US-A02 (실시간 모니터링) | Backend + Admin FE | Backend SSE -> Admin Dashboard 실시간 표시 |
| US-C01 (자동 로그인) | Backend + Customer FE | 테이블 인증 API + 클라이언트 자동 로그인 |
| US-A01 (매장 인증) | Backend + Admin FE | JWT 인증 API + Admin 로그인 UI |

## Per-Unit Construction Phase Plan

### Unit 1: Backend (Phase 1)
- Functional Design -> NFR Requirements -> NFR Design -> Code Generation
- 모든 API, DB 스키마, SSE, OpenAPI 스펙 포함

### Unit 2: Customer Frontend (Phase 2)
- Functional Design -> NFR Requirements -> NFR Design -> Code Generation
- Backend API 연동, OpenAPI 타입 생성

### Unit 3: Admin Frontend (Phase 3)
- Functional Design -> NFR Requirements -> NFR Design -> Code Generation
- Backend API + SSE 연동, OpenAPI 타입 생성
