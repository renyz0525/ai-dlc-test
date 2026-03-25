# Table Order Service - Requirements Document

## Intent Analysis

- **User Request**: 테이블오더 서비스 구축 (디지털 주문 시스템)
- **Request Type**: New Project (Greenfield)
- **Scope**: System-wide (고객 UI, 관리자 UI, 백엔드 API, 데이터베이스)
- **Complexity**: Complex (실시간 SSE, JWT 인증, 멀티 매장, 세션 관리)

---

## 1. Technology Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express.js |
| Frontend (Customer) | Vue.js + Vite + TailwindCSS + PrimeVue (TypeScript) |
| Frontend (Admin) | Vue.js + Vite + TailwindCSS + PrimeVue (TypeScript) |
| Database | PostgreSQL |
| Real-time | Server-Sent Events (SSE) |
| Authentication | JWT Token |
| Image Storage | Local file system (server) |
| Deployment | Local development environment (MVP) |

## 2. Project Structure

- **Backend**: 단일 Express.js 서버 (REST API + SSE)
- **Frontend - Customer**: 별도 Vue.js 프로젝트 (고객용 주문 인터페이스)
- **Frontend - Admin**: 별도 Vue.js 프로젝트 (관리자용 대시보드)
- **Multi-tenancy**: 멀티 매장 지원 (매장별 데이터 격리, store_id 기반)

---

## 3. Functional Requirements

### 3.1 Customer Features

#### FR-C01: Table Tablet Auto Login & Session Management
- 관리자가 초기 1회 설정 (매장 ID, 테이블 번호, 비밀번호)
- 설정 정보 로컬 저장 후 자동 로그인
- 16시간 세션 유지

#### FR-C02: Menu Browsing
- 메뉴 화면이 기본(홈) 화면
- 카테고리별 메뉴 분류 및 표시
- 메뉴 상세 정보: 메뉴명, 가격, 설명, 이미지
- 카테고리 간 빠른 이동
- 카드 형태 레이아웃, 터치 친화적 (최소 44x44px)

#### FR-C03: Cart Management
- 메뉴 추가/삭제, 수량 조절
- 총 금액 실시간 계산
- 장바구니 비우기
- 클라이언트 측 로컬 저장 (새로고침 시 유지)
- 서버 전송은 주문 확정 시에만

#### FR-C04: Order Creation
- 주문 내역 최종 확인 후 주문 확정
- 주문 성공: 주문 번호 표시 -> 장바구니 비우기 -> 5초 후 메뉴 화면 리다이렉트
- 주문 실패: 에러 메시지 표시, 장바구니 유지
- 주문 정보: 매장 ID, 테이블 ID, 메뉴 목록(메뉴명, 수량, 단가), 총 금액, 세션 ID

#### FR-C05: Order History View
- 현재 테이블 세션의 주문만 표시
- 주문 시간 순 정렬
- 주문별: 주문 번호, 시각, 메뉴/수량, 금액, 상태(대기중/준비중/완료)
- 이용 완료 처리된 주문 제외

### 3.2 Admin Features

#### FR-A01: Store Authentication
- 매장 ID + 사용자명 + 비밀번호 기반 로그인
- JWT 토큰 인증, 16시간 세션 유지
- 비밀번호 bcrypt 해싱
- 로그인 시도 제한

#### FR-A02: Real-time Order Monitoring
- SSE 기반 실시간 주문 업데이트 (2초 이내)
- 그리드/대시보드 레이아웃: 테이블별 카드 표시
- 각 카드: 테이블 번호, 총 주문액, 최신 주문 미리보기
- 주문 카드 클릭 시 상세 보기
- 주문 상태 변경 (대기중/준비중/완료)
- 신규 주문 시각적 강조
- 미확인 주문 주기적 시각 알림 (일정 시간 경과 후 깜빡임/펄스 애니메이션, 확인 시 중단)
- 테이블별 필터링

#### FR-A03: Table Management
- **테이블 초기 설정**: 테이블 번호/비밀번호 설정, 16시간 세션 생성
- **주문 삭제**: 확인 팝업 -> 즉시 삭제 -> 총 주문액 재계산
- **테이블 세션 종료(이용 완료)**: 확인 팝업 -> 주문 내역을 과거 이력으로 이동 -> 현재 주문/금액 리셋
- **과거 주문 내역 조회**: 테이블별, 시간 역순, 날짜 필터링

#### FR-A04: Menu Management
- 메뉴 CRUD (조회/등록/수정/삭제)
- 메뉴 정보: 메뉴명, 가격, 설명, 카테고리, 이미지
- 이미지 파일 업로드 (서버 로컬 스토리지)
- 메뉴 노출 순서 조정
- 필수 필드/가격 범위 검증

---

## 4. Non-Functional Requirements

### NFR-01: Performance
- SSE 기반 실시간 주문 표시 2초 이내
- 동시 50테이블 이하 지원

### NFR-02: Usability
- 터치 친화적 UI (44x44px 최소 버튼 크기)
- 직관적 카드 기반 레이아웃
- 명확한 시각적 계층 구조

### NFR-03: Data Management
- 멀티 매장 데이터 격리 (store_id 기반)
- 테이블 세션 기반 주문 그룹화
- 주문 이력 영구 보관 (OrderHistory)

### NFR-04: Authentication & Session
- JWT 기반 인증 (관리자)
- 테이블 태블릿 자동 로그인
- 16시간 세션 유지

---

## 5. Exclusions (Out of Scope)

- 결제 처리 (PG사 연동, 영수증, 환불, 포인트/쿠폰)
- 복잡한 인증 (OAuth, SNS 로그인, 2FA)
- 이미지 리사이징/최적화, CMS, 광고
- 알림 시스템 (푸시, SMS, 이메일, 소리/진동)
- 주방 전달, 재고 관리
- 데이터 분석, 매출 리포트, 직원 관리, 예약, 리뷰, 다국어
- 외부 연동 (배달 플랫폼, POS, 소셜 미디어, 지도/번역 API)

---

## 6. Multi-Tenancy Design

- 모든 핵심 테이블에 `store_id` 포함
- API 요청 시 매장 컨텍스트 확인
- 매장 간 데이터 완전 격리
- 1~5개 매장, 총 50개 이하 테이블 규모 지원

---

## 7. Extension Configuration

| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | No | Requirements Analysis |
