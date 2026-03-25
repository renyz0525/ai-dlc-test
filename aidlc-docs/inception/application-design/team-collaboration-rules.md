# Team Collaboration Rules (3인 개발)

## Developer Assignment

| 담당 | 개발자 1 | 개발자 2 | 개발자 3 |
|---|---|---|---|
| **Primary** | backend/ | customer-frontend/ | admin-frontend/ |
| **Phase 1** | Backend API 개발 | Mock API 기반 Customer UI 개발 | Mock API 기반 Admin UI 개발 |
| **Phase 2** | API 수정/버그픽스, OpenAPI 스펙 유지 | Backend API 연동 | Backend API + SSE 연동 |

### 개발 타임라인

```
Week 1-2: Phase 1 (병렬 개발)
+-----------+-------------------+-------------------+
| 개발자 1  | 개발자 2           | 개발자 3           |
| Backend   | Customer FE       | Admin FE          |
| API 개발  | Mock API + UI     | Mock API + UI     |
| DB 스키마 | 메뉴/장바구니/주문 | 대시보드/테이블/메뉴 |
| OpenAPI   | 컴포넌트 개발      | 컴포넌트 개발      |
+-----------+-------------------+-------------------+

Week 3: Phase 2 (API 연동)
+-----------+-------------------+-------------------+
| 개발자 1  | 개발자 2           | 개발자 3           |
| 버그픽스  | 실제 API 연동      | 실제 API + SSE 연동|
| API 조정  | 통합 테스트        | 통합 테스트        |
+-----------+-------------------+-------------------+
```

**Note**: 3명이 병렬 개발하므로 Frontend는 Backend 완료를 기다리지 않고 Mock API로 먼저 시작합니다.

---

## File Ownership (배타적 소유권)

### 개발자 1 전용
```
backend/
+-- src/routes/*
+-- src/middleware/*
+-- src/sse/*
+-- src/prisma/schema.prisma
+-- src/app.js
+-- src/server.js
+-- tests/*
```

### 개발자 2 전용
```
customer-frontend/
+-- src/views/*
+-- src/components/*
+-- src/store/*
+-- src/router/*
+-- src/App.vue
+-- src/main.js
+-- tests/*
```

### 개발자 3 전용
```
admin-frontend/
+-- src/views/*
+-- src/components/*
+-- src/store/*
+-- src/router/*
+-- src/App.vue
+-- src/main.js
+-- tests/*
```

### 공유 영역 (수정 시 사전 협의 필수)
```
backend/swagger.json              # 개발자1 작성, 개발자2/3 참조
customer-frontend/src/api/*       # OpenAPI에서 자동 생성 (개발자2 관리)
admin-frontend/src/api/*          # OpenAPI에서 자동 생성 (개발자3 관리)
package.json (각 프로젝트)          # 해당 프로젝트 담당자만 수정
```

---

## Git Branch Strategy

### Branch 구조
```
main
+-- develop
    +-- feature/backend/*         # 개발자 1 전용
    +-- feature/customer-fe/*     # 개발자 2 전용
    +-- feature/admin-fe/*        # 개발자 3 전용
```

### Branch 명명 규칙
- `feature/backend/auth` - Backend 인증 모듈
- `feature/backend/order` - Backend 주문 모듈
- `feature/customer-fe/menu-view` - Customer 메뉴 화면
- `feature/customer-fe/cart` - Customer 장바구니
- `feature/admin-fe/dashboard` - Admin 대시보드
- `feature/admin-fe/menu-mgmt` - Admin 메뉴 관리

### Merge 규칙
1. **develop 브랜치로만 merge** (main은 릴리즈 시만)
2. **PR 필수** - 최소 1명 리뷰 후 merge
3. **충돌 발생 시**: 해당 파일 소유자가 해결
4. **develop에서 주기적으로 pull** (최소 1일 1회)
5. **각 프로젝트 폴더는 독립적** - 다른 프로젝트 파일 충돌 가능성 거의 없음

---

## API Contract 규칙 (충돌 방지 핵심)

### 개발자 1 (Backend) 의무
1. API 엔드포인트 변경 시 **OpenAPI 스펙 먼저 업데이트**
2. 스펙 변경 후 **개발자 2, 3 모두에게 알림**
3. Breaking change 시 **3인 사전 협의 필수**
4. Response 형식 변경 금지 (기존 필드 삭제/타입 변경 X)
5. 새 필드 추가는 자유 (backward compatible)
6. SSE 이벤트 타입/페이로드 변경 시 **개발자 3에게 반드시 알림**

### 개발자 2 (Customer Frontend) 의무
1. API client는 **OpenAPI 스펙에서 자동 생성**만 사용
2. Backend, Admin Frontend 파일 수정 금지
3. Mock API는 **OpenAPI 스펙 기반** 으로 작성
4. API 요구사항 변경 필요 시 **개발자 1에게 요청**

### 개발자 3 (Admin Frontend) 의무
1. API client는 **OpenAPI 스펙에서 자동 생성**만 사용
2. Backend, Customer Frontend 파일 수정 금지
3. Mock API는 **OpenAPI 스펙 기반** 으로 작성
4. SSE 이벤트 형식은 **개발자 1과 사전 합의** 후 사용
5. API 요구사항 변경 필요 시 **개발자 1에게 요청**

---

## 충돌 방지 체크리스트

### Daily
- [ ] develop 브랜치에서 최신 변경사항 pull
- [ ] API 스펙 변경 확인 (swagger.json diff)
- [ ] 팀 채널에서 변경 알림 확인

### PR 전
- [ ] 내 담당 프로젝트 폴더 외 파일 수정 여부 확인
- [ ] 공유 영역 파일 수정 시 팀에 알림
- [ ] lint/format 실행 (코드 스타일 충돌 방지)

### 절대 하지 말 것
- 다른 개발자 전용 프로젝트 파일 수정
- 담당 프로젝트 외 package.json 수정
- OpenAPI 스펙 수동 수정 (개발자 2, 3)
- API response 형식 breaking change (개발자 1)
- develop/main에 직접 push (PR 필수)

---

## Communication Protocol

| 상황 | 행동 |
|---|---|
| API 엔드포인트 추가/변경 | 개발자1 -> 스펙 업데이트 -> 팀 채널에 알림 |
| Customer FE에서 새 API 필요 | 개발자2 -> 개발자1에 요청 |
| Admin FE에서 새 API 필요 | 개발자3 -> 개발자1에 요청 |
| SSE 이벤트 형식 변경 | 개발자1 <-> 개발자3 직접 협의 |
| 공유 파일 수정 필요 | 수정 전 팀 채널에 알림 -> 동시 수정 방지 |
| 충돌 발생 | 해당 파일 소유자가 해결 -> PR에서 리뷰 |
| DB 스키마 변경 | 개발자1 -> migration 생성 -> develop merge 후 알림 |

---

## 3인 체제 장점

- **프로젝트 폴더가 완전히 분리**되어 Git 충돌 발생 가능성 최소
- 유일한 충돌 지점은 **OpenAPI 스펙** (개발자1만 수정하므로 충돌 없음)
- 3명 병렬 개발로 전체 일정 단축
- 각 개발자가 자기 영역에 대한 완전한 소유권 보유
