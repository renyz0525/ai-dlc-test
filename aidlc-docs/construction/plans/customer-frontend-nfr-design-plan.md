# Customer Frontend - NFR Design Plan

## Unit Context
- **Unit**: customer-frontend
- **NFR Key Areas**: Responsive UI, Network Resilience, SSE Real-time, Mock/Real API Toggle, Testing

## NFR Design Steps

- [x] Step 1: Responsive Layout Pattern 설계
- [x] Step 2: Network Resilience Pattern 설계 (감지, 재연결, SSE 복구)
- [x] Step 3: API Layer Pattern 설계 (Mock/Real 전환, 에러 처리, 인증 인터셉터)
- [x] Step 4: State Persistence Pattern 설계 (localStorage 동기화)
- [x] Step 5: Logical Components 정의 (프론트엔드 인프라 구성요소)

---

## Clarification Questions

아래 질문에 답변해주세요. 각 질문의 [Answer]: 뒤에 선택지 알파벳을 입력해주세요.

## Question 1
API Layer 구조에서 Mock/Real 전환 패턴은?

A) 환경변수 분기 패턴 - API 모듈 내에서 `VITE_USE_MOCK` 확인 후 mock/real 함수 호출 분기
B) 모듈 교체 패턴 - `api/mock/` 와 `api/real/` 폴더를 분리하고 import 경로를 환경변수로 전환
C) Adapter 패턴 - 공통 인터페이스를 정의하고 MockAdapter/RealAdapter 구현체를 주입
D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 2
네트워크 상태 표시 UI 위치는?

A) 상단 고정 배너 - 헤더 바로 아래 전체 너비 경고 배너
B) Toast 알림 - 우측 상단 또는 하단에 일시적 토스트 메시지
C) 헤더 내 아이콘 - 헤더에 연결 상태 아이콘 (초록/빨강 점)
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 3
반응형 레이아웃에서 모바일 화면의 카테고리 사이드바 대체 방식은? (Functional Design에서 태블릿/데스크탑은 좌측 사이드바로 결정됨)

A) 상단 가로 스크롤 칩 - 카테고리를 가로 스크롤 칩으로 표시
B) 드롭다운 셀렉트 - 카테고리를 드롭다운으로 선택
C) 하단 시트(Bottom Sheet) - 카테고리 버튼 클릭 시 하단에서 올라오는 시트
D) Other (please describe after [Answer]: tag below)

[Answer]:B

## Question 4
PrimeVue 스타일링 방식은?

A) Styled Mode (기본) - PrimeVue 내장 테마 사용 + TailwindCSS 보조
B) Unstyled Mode + Tailwind - PrimeVue 기능만 사용, 모든 스타일을 TailwindCSS로 직접 구현
C) Other (please describe after [Answer]: tag below)

[Answer]:A
