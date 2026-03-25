# Components Definition

## 1. Backend Components

### 1.1 Auth Module
- **Purpose**: 관리자 인증 및 테이블 태블릿 인증 처리
- **Responsibilities**:
  - 관리자 로그인 (JWT 발급)
  - 테이블 태블릿 로그인 (세션 토큰 발급)
  - 토큰 검증 미들웨어
  - 로그인 시도 제한
- **Interface**: REST API endpoints

### 1.2 Store Module
- **Purpose**: 매장 정보 관리
- **Responsibilities**:
  - 매장 정보 조회
  - 멀티테넌시 컨텍스트 제공 (store_id 기반)
- **Interface**: REST API endpoints, 미들웨어

### 1.3 Menu Module
- **Purpose**: 메뉴 CRUD 및 이미지 관리
- **Responsibilities**:
  - 메뉴 조회 (카테고리별)
  - 메뉴 등록/수정/삭제
  - 메뉴 이미지 업로드 (로컬 스토리지)
  - 메뉴 노출 순서 관리
  - 입력 검증 (필수 필드, 가격 범위)
- **Interface**: REST API endpoints

### 1.4 Order Module
- **Purpose**: 주문 생성, 조회, 상태 관리
- **Responsibilities**:
  - 주문 생성 (고객)
  - 주문 내역 조회 (현재 세션)
  - 주문 상태 변경 (관리자)
  - 주문 삭제 (관리자)
  - SSE 이벤트 발행
- **Interface**: REST API endpoints, SSE stream

### 1.5 Table Module
- **Purpose**: 테이블 및 세션 라이프사이클 관리
- **Responsibilities**:
  - 테이블 초기 설정
  - 테이블 세션 시작/종료
  - 이용 완료 처리 (주문 이력 이동, 리셋)
  - 과거 주문 내역 조회
- **Interface**: REST API endpoints

### 1.6 SSE Module
- **Purpose**: 실시간 이벤트 스트리밍
- **Responsibilities**:
  - SSE 연결 관리 (매장별)
  - 신규 주문 이벤트 브로드캐스트
  - 주문 상태 변경 이벤트 브로드캐스트
  - 연결 유지 및 재연결 지원
- **Interface**: SSE endpoint

---

## 2. Customer Frontend Components

### 2.1 Auth (Auto Login)
- **Purpose**: 테이블 태블릿 자동 인증
- **Responsibilities**: 저장된 인증 정보로 자동 로그인, 세션 유지

### 2.2 Menu View
- **Purpose**: 메뉴 탐색 및 표시
- **Responsibilities**: 카테고리별 메뉴 표시, 카테고리 전환, 메뉴 상세 정보

### 2.3 Cart
- **Purpose**: 장바구니 관리
- **Responsibilities**: 메뉴 추가/삭제, 수량 조절, 총액 계산, 로컬 저장

### 2.4 Order
- **Purpose**: 주문 생성 및 확인
- **Responsibilities**: 주문 확인 화면, 주문 확정, 성공/실패 처리

### 2.5 Order History
- **Purpose**: 주문 내역 조회
- **Responsibilities**: 현재 세션 주문 목록 표시, 주문 상태 표시

---

## 3. Admin Frontend Components

### 3.1 Auth (Login)
- **Purpose**: 관리자 로그인
- **Responsibilities**: 로그인 폼, JWT 저장, 세션 관리

### 3.2 Dashboard (Order Monitor)
- **Purpose**: 실시간 주문 모니터링 대시보드
- **Responsibilities**: 테이블별 그리드 레이아웃, SSE 수신, 주문 카드 표시, 미확인 주문 알림, 주문 상태 변경, 필터링

### 3.3 Table Management
- **Purpose**: 테이블 세션 관리
- **Responsibilities**: 테이블 초기 설정, 주문 삭제, 이용 완료, 과거 내역 조회

### 3.4 Menu Management
- **Purpose**: 메뉴 CRUD 관리
- **Responsibilities**: 메뉴 목록, 등록/수정/삭제 폼, 이미지 업로드, 순서 조정
