# Admin Frontend - NFR Requirements

## 1. Performance Requirements

### NFR-PERF-01: Page Load Time
- **Target**: 대시보드 초기 로딩 3초 이내
- **Scope**: First Contentful Paint (FCP) 기준
- **Approach**: Vite 번들링 최적화, 코드 스플리팅 (라우트별 lazy loading)

### NFR-PERF-02: SSE Real-time Latency
- **Target**: SSE 이벤트 수신 후 UI 반영 500ms 이내
- **Scope**: 이벤트 수신 -> DOM 업데이트 완료
- **Approach**: Vuex mutation 기반 반응적 렌더링

### NFR-PERF-03: Dashboard Rendering
- **Target**: 10개 이하 테이블 카드 동시 렌더링
- **Scope**: 소규모 매장 기준 (1~10 테이블)
- **Approach**: 가상 스크롤 불필요, 단순 그리드 렌더링 충분

### NFR-PERF-04: Bundle Size
- **Target**: 초기 번들 500KB 이하 (gzipped)
- **Approach**: Tree-shaking, PrimeVue 개별 컴포넌트 import, 라우트별 코드 스플리팅

## 2. Usability Requirements

### NFR-UX-01: Device Support
- **Target**: 데스크탑 PC 전용
- **Minimum Resolution**: 1280x720
- **Responsive**: 불필요 (고정 레이아웃)
- **Layout**: 사이드바(고정폭) + 메인 콘텐츠(유동폭)

### NFR-UX-02: Browser Compatibility
- **Target**: 최신 Chrome만 지원
- **Minimum Version**: Chrome 120+
- **Polyfills**: 불필요

### NFR-UX-03: UI Feedback
- **Loading**: API 호출 중 로딩 인디케이터 표시
- **Success**: Toast 알림 (PrimeVue Toast)
- **Error**: Toast 알림 + 인라인 에러 메시지
- **Confirmation**: PrimeVue ConfirmDialog

### NFR-UX-04: Keyboard Support
- **Scope**: 기본 키보드 네비게이션 (Tab, Enter, Escape)
- **Accessibility**: WCAG 엄격 준수 불필요 (내부 관리 도구)

## 3. Reliability Requirements

### NFR-REL-01: SSE Connection Recovery
- **Strategy**: 자동 재연결
- **Retry**: 3초 간격, 최대 10회
- **UI Indicator**: 연결 상태 배지 (connected/reconnecting/disconnected)
- **Fallback**: 재연결 실패 시 수동 새로고침 안내

### NFR-REL-02: API Error Handling
- **Strategy**: 글로벌 에러 인터셉터 (Axios)
- **401 Unauthorized**: 자동 로그아웃 -> 로그인 페이지 리다이렉트
- **4xx Client Errors**: Toast 에러 메시지 표시
- **5xx Server Errors**: Toast 에러 메시지 + 재시도 안내
- **Network Errors**: 네트워크 상태 확인 안내

### NFR-REL-03: Data Consistency
- **SSE Sync**: SSE 이벤트로 실시간 동기화
- **Optimistic Update**: 주문 상태 변경 시 즉시 UI 반영, 실패 시 롤백
- **Stale Data**: 페이지 전환 시 데이터 재로드

## 4. Security Requirements

### NFR-SEC-01: Token Storage
- **Method**: localStorage
- **Token Format**: JWT (Bearer)
- **Expiry**: 16시간 (서버 설정과 동일)
- **Cleanup**: 로그아웃 시 localStorage 토큰 삭제

### NFR-SEC-02: API Communication
- **Auth Header**: 모든 API 요청에 Authorization: Bearer {token} 자동 포함
- **Axios Interceptor**: 요청 인터셉터에서 토큰 자동 주입
- **Token Expiry Check**: 클라이언트 측 JWT decode로 만료 사전 확인

### NFR-SEC-03: Input Sanitization
- **Vue Default**: Vue.js 템플릿 자동 이스케이핑 (XSS 방어)
- **v-html**: 사용 금지 (사용자 입력 HTML 렌더링 불가)
- **File Upload**: 클라이언트 측 파일 타입/크기 검증

### NFR-SEC-04: Login Protection
- **Rate Limiting**: 클라이언트 측 5회 실패 후 15분 잠금
- **Storage**: 잠금 상태 localStorage 저장

## 5. Maintainability Requirements

### NFR-MAIN-01: Code Structure
- **Language**: TypeScript (strict mode)
- **Style**: Composition API (Vue 3)는 불필요, Options API with Vuex 4 사용
- **Linting**: ESLint + Prettier
- **File Naming**: PascalCase (컴포넌트), camelCase (유틸리티/스토어)

### NFR-MAIN-02: Testing
- **Unit Test Framework**: Vitest
- **Component Test**: Vue Test Utils + Vitest
- **Coverage Target**: 주요 비즈니스 로직 및 Vuex Store 모듈 테스트
- **Test Location**: `tests/` 디렉토리 (소스와 분리)

### NFR-MAIN-03: Build & Development
- **Build Tool**: Vite
- **Dev Server**: Vite dev server (HMR)
- **API Proxy**: Vite proxy 설정으로 CORS 우회 (개발 환경)
- **Environment Variables**: .env 파일로 API URL 등 설정

## 6. Scalability Considerations

### NFR-SCALE-01: Small Scale Design
- **Target**: 1~5개 매장, 매장당 10개 이하 테이블
- **Concurrent Users**: 매장당 관리자 1~2명
- **Data Volume**: 소규모 (가상 스크롤, 페이지네이션 불필요)
- **Optimization**: 추후 필요 시 대응 (현재 MVP 수준)
