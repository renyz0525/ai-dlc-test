# Admin Frontend - NFR Design Patterns

## 1. Resilience Patterns

### 1.1 SSE Connection Recovery Pattern
```
EventSource 연결
    |
    v
[Connected] --연결 끊김--> [Reconnecting]
    ^                          |
    |                     3초 대기 후 재연결
    |                          |
    +------성공 시 복귀--------+
                               |
                          실패 카운트++
                               |
                     카운트 < 10 --> 재시도
                     카운트 >= 10 --> [Disconnected]
                                        |
                                   UI에 "연결 끊김" 배지
                                   "새로고침" 버튼 표시
```

**구현 방식:**
- `api/sse.ts`에서 SSE Manager 클래스 구현
- 재연결 로직: setTimeout 기반 3초 간격
- 최대 10회 시도 후 중단, 수동 새로고침 안내
- 연결 상태를 Vuex `dashboard.sseConnected`에 반영
- SSE 폴링 전환 없음 (Q1:A)

### 1.2 API Error Handling Pattern (Global Interceptor)
```
API 요청
    |
    v
[Axios Request Interceptor]
    - Authorization: Bearer {token} 헤더 추가
    |
    v
서버 응답
    |
    v
[Axios Response Interceptor]
    |
    +-- 2xx 성공 --> 데이터 반환
    +-- 401 Unauthorized --> 토큰 삭제 + Vuex 초기화 + /login 리다이렉트
    +-- 4xx Client Error --> Toast 에러 메시지 표시
    +-- 5xx Server Error --> Toast 에러 메시지 + "서버 오류" 안내
    +-- Network Error --> Toast "네트워크 연결을 확인하세요" 메시지
```

**구현 방식:**
- `api/client.ts`에서 Axios 인스턴스 생성 및 인터셉터 설정
- 자동 재시도 없음 (Q2:A), 즉시 에러 표시
- 에러 메시지는 서버 응답의 `message` 필드 사용, 없으면 기본 메시지

### 1.3 Optimistic Update Pattern
```
사용자 액션 (예: 주문 상태 변경)
    |
    v
[1] UI 즉시 업데이트 (Vuex mutation)
    |
    v
[2] API 요청 전송
    |
    +-- 성공 --> 완료 (UI 이미 반영됨)
    +-- 실패 --> [3] UI 롤백 (이전 상태 복원) + 에러 Toast
```

**적용 대상:**
- 주문 상태 변경 (pending -> preparing -> completed)
- 주문 삭제 (목록에서 즉시 제거)

**비적용 대상 (서버 응답 후 반영):**
- 메뉴 CRUD (폼 제출 후 성공 시 목록 갱신)
- 테이블 설정 (서버 검증 필요)
- 이용 완료 (복합 서버 작업)

## 2. Performance Patterns

### 2.1 Route-based Code Splitting
```typescript
// router/index.ts
const routes = [
  { path: '/login', component: () => import('../views/LoginView.vue') },
  { path: '/dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/tables', component: () => import('../views/TableManagementView.vue') },
  { path: '/tables/setup', component: () => import('../views/TableSetupView.vue') },
  { path: '/menus', component: () => import('../views/MenuManagementView.vue') },
]
```

**효과:** 초기 번들에는 Login + 공통 레이아웃만 포함, 나머지는 라우트 접근 시 로딩

### 2.2 PrimeVue Tree-shaking Import
```typescript
// main.ts - 개별 컴포넌트 등록
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
// ... 필요한 컴포넌트만 import

app.component('Button', Button);
app.component('Dialog', Dialog);
// ...
```

**효과:** 사용하지 않는 PrimeVue 컴포넌트 제외, 번들 크기 감소

### 2.3 SSE Event Batch Processing
```
SSE 이벤트 수신
    |
    v
[이벤트 핸들러]
    - 단일 Vuex commit으로 상태 업데이트
    - Vue 반응성 시스템이 자동으로 DOM 업데이트 배치 처리
    - 별도 디바운싱 불필요 (소규모 10테이블)
```

## 3. Security Patterns

### 3.1 JWT Token Management Pattern
```
앱 시작
    |
    v
[initAuth Action]
    - localStorage에서 토큰 읽기
    - JWT decode로 만료 확인
    |
    +-- 유효 --> Vuex에 인증 상태 설정, Axios 기본 헤더 설정
    +-- 만료/없음 --> /login 리다이렉트

API 요청 시
    |
    v
[Request Interceptor]
    - Vuex에서 토큰 읽기
    - Authorization 헤더에 추가

로그아웃
    |
    v
[logout Action]
    - localStorage 토큰 삭제
    - Vuex 상태 초기화
    - SSE 연결 해제
    - /login 리다이렉트
```

### 3.2 Route Guard Pattern
```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.path === '/login') {
    isAuthenticated ? next('/dashboard') : next();
  } else {
    isAuthenticated ? next() : next({ path: '/login', query: { redirect: to.fullPath } });
  }
});
```

### 3.3 Input Security
- **Vue Template**: 기본 텍스트 보간 (`{{ }}`) 사용으로 자동 XSS 방어
- **v-html 금지**: 코드 리뷰에서 v-html 사용 차단
- **File Upload**: 클라이언트 측 MIME 타입 + 확장자 + 크기 검증

## 4. State Management Patterns

### 4.1 Vuex Module Pattern
```
store/
+-- index.ts              # createStore, 모듈 등록
+-- modules/
    +-- auth.ts           # 인증 (독립)
    +-- dashboard.ts      # 대시보드 + SSE (핵심)
    +-- tables.ts         # 테이블 관리 (독립)
    +-- menus.ts          # 메뉴/카테고리 관리 (독립)
```

**모듈 간 의존성:**
- `dashboard`는 `auth`의 storeId를 참조 (rootGetters)
- `tables`와 `menus`는 `auth`의 storeId를 참조 (rootGetters)
- 모듈 간 직접 의존성 없음 (느슨한 결합)

### 4.2 SSE -> Vuex Integration Pattern
```
[SSE Manager] --이벤트 수신--> [Store Dispatch]
                                    |
                                    v
                        dashboard/handleSSEEvent action
                                    |
              +---------------------+---------------------+
              |                     |                     |
        order:created         order:statusChanged    order:deleted
              |                     |                     |
         ADD_ORDER         UPDATE_ORDER_STATUS      REMOVE_ORDER
         ADD_UNACKNOWLEDGED                         (총액 재계산)
         (30초 타이머 시작)
```

**구현:** SSE Manager가 store.dispatch를 직접 호출하는 콜백 패턴

### 4.3 Unacknowledged Order Timer Pattern
```
신규 주문 도착 (order:created)
    |
    v
[ADD_UNACKNOWLEDGED] mutation
    - unacknowledgedOrderIds에 추가
    - setTimeout(30000) 등록 -> 30초 후 타이머 ID 저장
    |
    v (30초 후)
[SET_ALERT_ACTIVE] mutation
    - 해당 테이블 카드에 alertActive = true
    - CSS pulse 애니메이션 트리거

확인 시 (모달 열기 또는 상태 변경)
    |
    v
[REMOVE_UNACKNOWLEDGED] mutation
    - unacknowledgedOrderIds에서 제거
    - clearTimeout으로 타이머 정리
    - alertActive = false
```

**타이머 관리:**
- 타이머 ID를 Map<orderId, timeoutId>로 관리
- 컴포넌트 unmount 또는 로그아웃 시 모든 타이머 정리
- SSE 재연결 시 기존 타이머 유지

## 5. Styling Pattern

### 5.1 PrimeVue Aura Theme + TailwindCSS (Q3:A)
```
스타일링 우선순위:
1. PrimeVue Aura 기본 테마 (컴포넌트 기본 스타일)
2. TailwindCSS 유틸리티 (레이아웃, 간격, 커스텀 스타일)
3. 필요 시 PrimeVue passthrough로 세부 커스터마이징

설정:
- PrimeVue: Aura preset + TailwindCSS 통합 설정
- TailwindCSS: PrimeVue와 충돌 방지 위한 prefix 불필요 (Aura는 TailwindCSS 호환)
```
