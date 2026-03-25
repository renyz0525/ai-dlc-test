# User Stories

## Epic 1: Customer Stories (고객 스토리)

### US-C01: 테이블 태블릿 자동 로그인
**As a** 매장 고객
**I want to** 테이블 태블릿에서 별도 로그인 없이 바로 주문 화면을 볼 수 있기를
**So that** 대기 없이 즉시 메뉴를 탐색하고 주문할 수 있다

**Acceptance Criteria:**
- Given 관리자가 태블릿에 매장ID, 테이블번호, 비밀번호를 1회 설정했을 때
  - When 태블릿 브라우저를 열면
  - Then 저장된 정보로 자동 로그인되어 메뉴 화면이 표시된다
- Given 자동 로그인 정보가 저장되어 있을 때
  - When 페이지를 새로고침하면
  - Then 세션이 유지되어 로그인 상태가 유지된다
- Given 세션이 만료되었을 때
  - When 태블릿에 접근하면
  - Then 저장된 정보로 자동 재로그인을 시도한다

**Persona**: Customer
**Priority**: High

---

### US-C02: 메뉴 조회 및 탐색
**As a** 매장 고객
**I want to** 카테고리별로 메뉴를 탐색하고 상세 정보를 확인하기를
**So that** 원하는 메뉴를 쉽게 찾아서 선택할 수 있다

**Acceptance Criteria:**
- Given 메뉴 화면에 접속했을 때
  - When 화면이 로드되면
  - Then 카테고리별로 분류된 메뉴 목록이 카드 형태로 표시된다
- Given 메뉴 목록이 표시되었을 때
  - When 특정 카테고리를 선택하면
  - Then 해당 카테고리의 메뉴만 필터링되어 표시된다
- Given 메뉴 카드가 표시되었을 때
  - When 메뉴 카드를 확인하면
  - Then 메뉴명, 가격, 설명, 이미지가 표시된다
- Given 여러 카테고리가 존재할 때
  - When 카테고리 간 이동하면
  - Then 빠르게 해당 카테고리로 스크롤/전환된다

**Persona**: Customer
**Priority**: High

---

### US-C03: 장바구니 관리
**As a** 매장 고객
**I want to** 주문 전에 선택한 메뉴를 장바구니에서 확인하고 수정하기를
**So that** 최종 주문 전에 수량과 금액을 조정할 수 있다

**Acceptance Criteria:**
- Given 메뉴 화면에서 메뉴를 선택했을 때
  - When 메뉴를 장바구니에 추가하면
  - Then 장바구니에 해당 메뉴가 추가되고 총 금액이 업데이트된다
- Given 장바구니에 메뉴가 있을 때
  - When 수량을 증가/감소하면
  - Then 수량과 총 금액이 실시간으로 재계산된다
- Given 장바구니에 메뉴가 있을 때
  - When 특정 메뉴를 삭제하면
  - Then 해당 메뉴가 제거되고 총 금액이 재계산된다
- Given 장바구니에 메뉴가 있을 때
  - When 페이지를 새로고침하면
  - Then 장바구니 내용이 유지된다 (로컬 저장)
- Given 장바구니에 메뉴가 있을 때
  - When 장바구니 비우기를 실행하면
  - Then 모든 메뉴가 제거되고 총 금액이 0이 된다

**Persona**: Customer
**Priority**: High

---

### US-C04: 주문 생성
**As a** 매장 고객
**I want to** 장바구니의 메뉴를 최종 확인 후 주문을 확정하기를
**So that** 실제 주문이 매장에 전달된다

**Acceptance Criteria:**
- Given 장바구니에 메뉴가 있을 때
  - When 주문 확정 버튼을 누르면
  - Then 주문 내역(메뉴명, 수량, 단가, 총액)이 최종 확인 화면에 표시된다
- Given 주문 확인 화면에서
  - When 주문을 최종 확정하면
  - Then 주문이 서버에 전송되고 주문 번호가 표시된다
- Given 주문이 성공했을 때
  - When 주문 번호가 표시되면
  - Then 장바구니가 자동으로 비워지고 5초 후 메뉴 화면으로 리다이렉트된다
- Given 주문 전송 중 오류가 발생했을 때
  - When 서버가 에러를 반환하면
  - Then 에러 메시지가 표시되고 장바구니는 유지된다
- Given 주문이 생성될 때
  - When 주문 정보가 전송되면
  - Then 매장ID, 테이블ID, 메뉴 목록, 총 금액, 세션ID가 포함된다

**Persona**: Customer
**Priority**: High

---

### US-C05: 주문 내역 조회
**As a** 매장 고객
**I want to** 현재 테이블의 주문 이력을 확인하기를
**So that** 이전에 주문한 내역과 상태를 파악할 수 있다

**Acceptance Criteria:**
- Given 주문 내역 화면에 접속했을 때
  - When 화면이 로드되면
  - Then 현재 테이블 세션의 주문만 시간순으로 표시된다
- Given 주문 내역이 표시되었을 때
  - When 주문 항목을 확인하면
  - Then 주문 번호, 시각, 메뉴/수량, 금액, 상태(대기중/준비중/완료)가 표시된다
- Given 이전 세션의 주문이 있을 때
  - When 주문 내역을 조회하면
  - Then 이용 완료 처리된 이전 세션 주문은 표시되지 않는다

**Persona**: Customer
**Priority**: Medium

---

## Epic 2: Admin Stories (관리자 스토리)

### US-A01: 매장 인증
**As a** 매장 관리자
**I want to** 매장 관리 시스템에 안전하게 로그인하기를
**So that** 내 매장의 주문과 메뉴를 관리할 수 있다

**Acceptance Criteria:**
- Given 관리자 로그인 화면에서
  - When 매장ID, 사용자명, 비밀번호를 입력하고 로그인하면
  - Then JWT 토큰이 발급되고 관리자 대시보드로 이동한다
- Given 로그인에 성공했을 때
  - When 브라우저를 새로고침하면
  - Then 세션이 유지된다 (16시간)
- Given 세션이 16시간 경과했을 때
  - When 페이지에 접근하면
  - Then 자동 로그아웃되고 로그인 화면으로 이동한다
- Given 잘못된 인증 정보로
  - When 반복 로그인을 시도하면
  - Then 일정 횟수 초과 시 로그인 시도가 제한된다

**Persona**: Admin
**Priority**: High

---

### US-A02: 실시간 주문 모니터링
**As a** 매장 관리자
**I want to** 들어오는 주문을 실시간으로 테이블별 대시보드에서 확인하기를
**So that** 주문을 놓치지 않고 빠르게 처리할 수 있다

**Acceptance Criteria:**
- Given 관리자 대시보드에 접속했을 때
  - When 화면이 로드되면
  - Then 테이블별 카드가 그리드 레이아웃으로 표시된다
- Given 대시보드가 표시되었을 때
  - When 각 테이블 카드를 확인하면
  - Then 테이블 번호, 총 주문액, 최신 주문 미리보기가 표시된다
- Given 고객이 새 주문을 생성했을 때
  - When SSE를 통해 주문이 전달되면
  - Then 2초 이내에 해당 테이블 카드에 주문이 표시되고 시각적으로 강조된다
- Given 테이블 카드에 주문이 표시되었을 때
  - When 주문 카드를 클릭하면
  - Then 전체 메뉴 목록 상세 정보가 표시된다
- Given 주문 상세를 확인한 후
  - When 주문 상태를 변경하면 (대기중 -> 준비중 -> 완료)
  - Then 상태가 즉시 업데이트되고 고객 화면에도 반영된다
- Given 많은 테이블이 있을 때
  - When 테이블별 필터링을 사용하면
  - Then 선택한 테이블의 주문만 표시된다
- Given 신규 주문이 "대기중" 상태로 일정 시간(예: 30초) 경과했을 때
  - When 관리자가 해당 주문을 확인(클릭 또는 상태 변경)하지 않으면
  - Then 해당 테이블 카드에 주기적인 시각적 알림(깜빡임/펄스 애니메이션)이 표시된다
- Given 미확인 주문 알림이 표시되고 있을 때
  - When 관리자가 해당 주문을 확인(클릭 또는 상태 변경)하면
  - Then 시각적 알림이 즉시 중단된다

**Persona**: Admin
**Priority**: High

---

### US-A03: 테이블 초기 설정
**As a** 매장 관리자
**I want to** 테이블 태블릿의 초기 인증 정보를 설정하기를
**So that** 고객이 별도 로그인 없이 바로 주문할 수 있다

**Acceptance Criteria:**
- Given 테이블 관리 화면에서
  - When 테이블 번호와 비밀번호를 설정하면
  - Then 16시간 세션이 생성되고 자동 로그인이 활성화된다
- Given 설정이 완료되었을 때
  - When 태블릿에서 해당 정보로 접근하면
  - Then 자동 로그인되어 메뉴 화면이 표시된다

**Persona**: Admin
**Priority**: High

---

### US-A04: 주문 삭제 (직권 수정)
**As a** 매장 관리자
**I want to** 잘못된 주문을 삭제하기를
**So that** 정확한 주문 내역과 금액을 유지할 수 있다

**Acceptance Criteria:**
- Given 테이블의 주문 목록에서
  - When 특정 주문의 삭제 버튼을 누르면
  - Then 확인 팝업이 표시된다
- Given 확인 팝업에서
  - When 삭제를 확정하면
  - Then 주문이 즉시 삭제되고 테이블 총 주문액이 재계산된다
- Given 삭제가 처리된 후
  - When 결과가 표시되면
  - Then 성공/실패 피드백이 표시된다

**Persona**: Admin
**Priority**: Medium

---

### US-A05: 테이블 세션 종료 (이용 완료)
**As a** 매장 관리자
**I want to** 고객의 식사가 끝나면 테이블 세션을 종료하기를
**So that** 새 고객이 이전 주문 없이 깨끗한 상태에서 시작할 수 있다

**Acceptance Criteria:**
- Given 테이블 관리 화면에서
  - When 이용 완료 버튼을 누르면
  - Then 확인 팝업이 표시된다
- Given 확인 팝업에서
  - When 이용 완료를 확정하면
  - Then 현재 세션의 주문 내역이 과거 이력으로 이동된다
- Given 이용 완료가 처리된 후
  - When 테이블 상태를 확인하면
  - Then 현재 주문 목록과 총 주문액이 0으로 리셋된다
- Given 새 고객이 해당 테이블에 앉았을 때
  - When 첫 주문을 생성하면
  - Then 새로운 세션이 시작되고 이전 주문은 보이지 않는다

**Persona**: Admin
**Priority**: High

---

### US-A06: 과거 주문 내역 조회
**As a** 매장 관리자
**I want to** 테이블별 과거 주문 내역을 조회하기를
**So that** 이전 고객의 주문 이력을 확인할 수 있다

**Acceptance Criteria:**
- Given 테이블 관리 화면에서
  - When 과거 내역 버튼을 누르면
  - Then 해당 테이블의 과거 주문 목록이 시간 역순으로 표시된다
- Given 과거 주문 목록이 표시되었을 때
  - When 각 주문을 확인하면
  - Then 주문 번호, 시각, 메뉴 목록, 총 금액, 이용 완료 시각이 표시된다
- Given 과거 주문이 많을 때
  - When 날짜 필터링을 사용하면
  - Then 선택한 날짜 범위의 주문만 표시된다
- Given 과거 내역 화면에서
  - When 닫기 버튼을 누르면
  - Then 대시보드로 복귀한다

**Persona**: Admin
**Priority**: Low

---

### US-A07: 메뉴 관리
**As a** 매장 관리자
**I want to** 매장의 메뉴를 등록, 수정, 삭제하기를
**So that** 고객에게 최신 메뉴 정보를 제공할 수 있다

**Acceptance Criteria:**
- Given 메뉴 관리 화면에서
  - When 메뉴 목록을 조회하면
  - Then 카테고리별로 등록된 메뉴가 표시된다
- Given 메뉴 등록 화면에서
  - When 메뉴명, 가격, 설명, 카테고리, 이미지를 입력하고 등록하면
  - Then 새 메뉴가 등록되고 고객 화면에 반영된다
- Given 메뉴 등록 시
  - When 필수 필드가 비어있거나 가격이 범위를 벗어나면
  - Then 검증 에러 메시지가 표시된다
- Given 메뉴 이미지를 업로드할 때
  - When 이미지 파일을 선택하면
  - Then 서버 로컬 스토리지에 업로드되고 미리보기가 표시된다
- Given 기존 메뉴를 수정할 때
  - When 메뉴 정보를 변경하고 저장하면
  - Then 변경 사항이 즉시 반영된다
- Given 메뉴를 삭제할 때
  - When 삭제를 확정하면
  - Then 메뉴가 삭제되고 고객 화면에서 제거된다
- Given 메뉴 노출 순서를 변경할 때
  - When 순서를 조정하면
  - Then 고객 화면에서 변경된 순서로 표시된다

**Persona**: Admin
**Priority**: High

---

## Story-Persona Mapping

| Story ID | Story Name | Persona | Priority |
|---|---|---|---|
| US-C01 | 테이블 태블릿 자동 로그인 | Customer | High |
| US-C02 | 메뉴 조회 및 탐색 | Customer | High |
| US-C03 | 장바구니 관리 | Customer | High |
| US-C04 | 주문 생성 | Customer | High |
| US-C05 | 주문 내역 조회 | Customer | Medium |
| US-A01 | 매장 인증 | Admin | High |
| US-A02 | 실시간 주문 모니터링 | Admin | High |
| US-A03 | 테이블 초기 설정 | Admin | High |
| US-A04 | 주문 삭제 (직권 수정) | Admin | Medium |
| US-A05 | 테이블 세션 종료 (이용 완료) | Admin | High |
| US-A06 | 과거 주문 내역 조회 | Admin | Low |
| US-A07 | 메뉴 관리 | Admin | High |

## INVEST Criteria Verification

| Criteria | Status | Notes |
|---|---|---|
| **Independent** | Pass | 각 스토리는 독립적으로 구현 가능 |
| **Negotiable** | Pass | 구현 방식에 유연성 있음 |
| **Valuable** | Pass | 각 스토리가 사용자에게 직접적 가치 제공 |
| **Estimable** | Pass | Feature 수준으로 추정 가능한 범위 |
| **Small** | Pass | 각 스토리가 단일 기능 단위 |
| **Testable** | Pass | Given/When/Then acceptance criteria 포함 |
